
const { mqttClient } = require ('../lib/mqttclient')
const { log } = require('../utils')
const moment = require('moment')
const { compose, pipe } = require('ramda')
const R = require('ramda')
import { prop } from './../utils/fp.utils'
// require('../initialize')
const Stream  =require('../fp/stream')
 
const fs = require('fs');

// const url = 'http://micasitatucasita.com:3000'
// const io = require('socket.io-client')(url);
// // auto initialize client MQTT
// mqttClient(io)
const intervals = []
const as = []
const FILE = 'kalendar.json';

const toMoment = x => moment(x)
const gteNow = pipe(toMoment, x => x.isAfter())
const lteNow = pipe(gteNow, R.not)

const emitIrrigate = value => {
  log('EMIT IRRIGATION')(`${value} (${process.pid}) so emit the event made riego`);
  // io.emit('made riego', 'programado', value.duration);
  return value;
}

const toString = value => value.toString('utf-8');

const getIrrigation = irrigation =>  console.log(toMoment(irrigation))|| Stream(observer => {
 
  const interval = setInterval(()=> {
    if(lteNow(irrigation)) {
      observer.next(irrigation)
      observer.complete();
      clearInterval(interval)
    }
  }, 1000);

  intervals.push(interval)
  return ()  => clearInterval(interval);
});


const madeIrrigation = date => console.log(date) || getIrrigation(date).subscribe({
  next: emitIrrigate,
  error: console.error,
  complete: () => log('COMPLETE IRRIAGATIONS')('there no more irrigations')
});


// const obsTimer = irrigate => timer(irrigate).subscribe({
//   next: emitIrrigate,
//   error: console.error,
//   complete: _ => log('COMPLETE IRRIAGATIONS')('there no more irrigations')
// });

const getJsonDates = compose(
  prop('dates'),
  JSON.parse,
  toString
)


  
const getIrrigations = file => new Stream(subscriber => {
  let _continue = true
  fs.readFile(file, function (err, data) { 
    if(_continue){
      if(err) {
        subscriber.error(err);
      } else{
        subscriber.next(data);
        subscriber.complete();
      }
    }
  });
  return () => {
    _continue = false;
  };
})


const proc = R.pipe(
  getIrrigations,
  R.map(getJsonDates),
  x => x.mergeAllgetIrrigation()
)

export const scheduler =  () => {
  log('START SCHEDULER')(`${new Date()} (${process.pid}) start scheduler changed json`);

  // intervals.forEach(
  //   x => {
  //  clearInterval(x)
  // })
  // intervals.length = 0
  // const readFile = file => new Observable(subscriber => {
  //   let _continue = true;
  //   fs.readFile(file, function (err, data) { 
  //     if(_continue){
  //       if(err) {
  //         subscriber.error(err);
  //       } else{
  //         subscriber.next(data);
  //         subscriber.complete();
  //       }
  //     }
  //   });
  //   return () => {
  //     _continue = false;
  //   };
  // });

  
  
  // const proc = file => from(readFile(file)).pipe(
  //   map(getJsonDates),
  //   map(R.filter(gteNow)),
  //   map(R.map(obsTimer)),
  //   switchMap()
  // )
  proc(FILE)

    .subscribe({
      next: _ => {},
      error: _ => log('ERROR LOAD JSON DATA')(`${new Date()} (${process.pid})`),
      complete: _ => log('LOADED DATA JSON')(`${new Date()} (${process.pid})`)
    });
}
fs.watchFile(FILE, scheduler);
// module.exports =  {scheduler}
