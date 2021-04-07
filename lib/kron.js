const moment = require('moment')
const { compose, pipe, curry } = require('ramda')
const { fork } = require('fluture')
const R = require('ramda')
const fs = require('fs');
const { prop } = require('./../utils/fp.utils')
const Stream  = require('../fp/stream')
const { irrigate } = require ('../lib/mqttclient')
const { kalendar : { file }} = require('../config')
const { logger } = require('../utils/log.utils')
 

const cancelations = []

const toMoment = x => moment(x)
const gteNow = pipe(toMoment, x => x.isAfter())
const lteNow = pipe(gteNow, R.not)

const emitIrrigate = curry((io, f, x) => {
  
  f(io)
})

const toString = value => value.toString('utf-8');

const getIrrigation = irrigation =>{ 
  
  const cancel = Stream(observer => {
 
    const interval = irrigation && setInterval(()=> {
      if(lteNow(irrigation)) {
        observer.next(irrigation)
        observer.complete();
        clearInterval(interval)
      }
    }, 1000);

    cancelations.push(() => clearInterval(interval))
    return () => clearInterval(interval)
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

const log = msg => fork (console.error) (console.log) (logger(msg))


const changeJson = (file) => Stream(subscriber => {
  log('[CHANGED JSON] json updated as read it');
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

export const kron = io => {
  log('[START SCHEDULER] start scheduler changed json');
  proc(file).subscribe({
      next: x => emitIrrigate(io, irrigate, x),
      error: _ => log('ERROR LOAD JSON DATA')(`${new Date()} (${process.pid})`),
      complete: _ => log('LOADED DATA JSON')(`${new Date()} (${process.pid})`)
  });
}