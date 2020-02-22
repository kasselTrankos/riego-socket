
import {date as D} from './../fp/date';
import Stream from './../fp/stream';
import {pipe, chain, map, prop, compose, flatmap, filter} from './../utils/fp.utils'
 
const fs = require('fs');

const url = 'http://micasitatucasita.com:3000'
const io = require('socket.io-client')(url);
const FILE = 'kalendar.json';
fs.watchFile(FILE, scheduler);

const emitIrrigate = value => {
  console.log(`${new Date()} (${process.pid}) so emit the event made riego`);
  io.emit('made riego', 'programado', value.duration);
  return value;
}


function scheduler () {
  console.log(`${new Date()} (${process.pid}) start scheduler changed json`);
  const isOverNow = ({date:d}) => !D.of(d).lte(new Date());
  const toString = value => value.toString('utf-8');
  const readFile = file => new Stream(observer => {
    const _continue = true;
    fs.readFile(file, function (err, data) { 
      if(_continue){
        if(err) {
          observer.error(err);
        } else{
          observer.next(data);
          observer.complete();
        }
      }
    });
    return () => {
      _continue = false;
    };
  });
  const timer = irrigate => new Stream(observer => {
    const interval = setInterval(()=> {
      if(D.of(irrigate.date).lte(new Date())) {
        observer.next(irrigate)
        observer.complete();
        clearInterval(interval);
      }
    }, 1000);
    return ()=> clearInterval(interval);
  });
  const program = pipe(
    readFile,
    map(compose(prop('dates'), JSON.parse, toString)),
    flatmap(x=>x),
    filter(isOverNow),
    chain(timer)
    // map(console.log)
  );

  program(FILE)
    .subscribe({
      next: emitIrrigate,
      error: console.error,
      complete: () => console.log('completed is yex, need one action')
    });


//   kron(FILE)
//     .map(compose(prop('dates'), JSON.parse, toString))
//     .flatMap(x=> x)
//     .filter(isOverNow)
//     .mergeMap(timer)
//     .subscribe({
//       next: emitIrrigate,
//       complete: x=> console.log(x, '11dddddd111')
//     });
}

module.exports =  {scheduler}
