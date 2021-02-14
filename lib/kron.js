
const { mqttClient } = require ('../lib/mqttclient')
const { log } = require('../utils')
const moment = require('moment')
const { compose, pipe } = require('ramda')
const R = require('ramda')
import { prop } from './../utils/fp.utils'
// require('../initialize')
const Stream  =require('../fp/stream')
 
const fs = require('fs');
const { kalendar : { file }} = require('../config')

// const url = 'http://micasitatucasita.com:3000'
// const io = require('socket.io-client')(url);
// // auto initialize client MQTT
// mqttClient(io)
const cancelations = []
// const FILE = 'kalendar.json';

const toMoment = x => moment(x)
const gteNow = pipe(toMoment, x => x.isAfter())
const lteNow = pipe(gteNow, R.not)

const emitIrrigate = value => {
  log('EMIT IRRIGATION')(`${value} (${process.pid}) so emit the event made riego`);
  return value;
}

const toString = value => value.toString('utf-8');

const getIrrigation = irrigation =>{ 
  
  const cancel = Stream(observer => {
 
    const interval = irrigation && setInterval(()=> {
      console.log(lteNow(irrigation), irrigation, moment())
      if(lteNow(irrigation)) {
        observer.next(irrigation)
        observer.complete();
        clearInterval(interval)
      }
    }, 1000);

    cancelations.push(()=> clearInterval(interval))
    return ()  => clearInterval(interval);
  })
  return cancel
};

// getJsonDatesProp :: Buffer -> [] 
const getJsonDatesProp = compose(
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
const cancelPreviousProcess = x => {
  cancelations.map(f => f())
  return x
}


const changeJson = (file) => Stream(subscriber => {
  log('CHANGED JSON')(`${new Date()} (${process.pid})`);
  fs.watchFile(file, () => {
    subscriber.next(file)
  })
  subscriber.next(file)
  return ()=> {}
})
const proc = R.pipe(
  changeJson,
  R.map(cancelPreviousProcess),
  R.chain(getIrrigations),
  R.map(getJsonDatesProp),
  R.map(R.filter(gteNow)),
  x => x.mergeMap(getIrrigation)
)

export const scheduler =  () => {
  log('START SCHEDULER')(`${new Date()} (${process.pid}) start scheduler changed json`);
  proc(file)
    .subscribe({
      next: x => log('NEXT')(x),
      error: _ => log('ERROR LOAD JSON DATA')(`${new Date()} (${process.pid})`),
      complete: _ => log('LOADED DATA JSON')(`${new Date()} (${process.pid})`)
    });
}
module.exports =  {scheduler}