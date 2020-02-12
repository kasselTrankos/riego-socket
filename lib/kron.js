
import {date as D} from './../fp/date';
import Irrigation from '@functional-lib/irrigation';
import { Observable } from 'rxjs/Rx';
 
const fs = require('fs');

const url = 'http://micasitatucasita.com:3000'
const io = require('socket.io-client')(url);
const FILE = 'kalendar.json';
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)
const prop = key => o => o[key];
fs.watchFile(FILE, scheduler);

const emitIrrigate = value => {
  console.log(`${new Date()} (${process.pid}) so emit the event made riego`);
  io.emit('made riego', 'programado', value.duration);
  return value;
}


function scheduler () {
  const isOverNow = ({date:d}) => !D.of(d).lte(new Date());
  const toString = value => value.toString('utf-8');
  const decode = task => task.map(compose(Irrigation.from, prop('dates'), JSON.parse, toString));  
  console.log(`${new Date()} (${process.pid}) start scheduler changed json`);
  const kron = Observable.bindNodeCallback(fs.readFile);
  const timer = irrigate =>  Observable.create(observer => {
    const interval = setInterval(()=> {
      if(D.of(irrigate.date).lte(new Date())) {
        observer.next(irrigate)
        observer.complete();
        observer.unsubscribe();
        clearInterval(interval);
      }
    }, 1000);
  })
  kron(FILE)
    .map(compose(prop('dates'), JSON.parse, toString))
    .flatMap(x=> x)
    .filter(isOverNow)
    // .mergeMap(timer)
    .subscribe({
      next: console.log, // emitIrrigate,
      complete: x=> console.log(x, '11dddddd111')
    });
}

module.exports =  {scheduler}
