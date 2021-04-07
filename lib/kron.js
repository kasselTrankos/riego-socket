const fs = require('fs');
const moment = require('moment')
const { fork } = require('fluture')
const { compose, pipe, curry, map, chain, not, filter, prop, nth, __ } = require('ramda')
const Stream  = require('../fp/stream')
const { irrigate } = require ('../lib/mqttclient')
const { kalendar : { file }} = require('../config')
const { logger } = require('../utils/log.utils')
const { updateKalendarDates } = require('../lib/kalendar')
const { find } = require('../src/irrigations')
 

const cancelations = []
// toString :: Any -> String
const toString = value => value.toString('utf-8');

// log :: String -> *
const log = msg => fork (console.error) (console.log) (logger(msg))


// toMoment :: String -> Moment
const toMoment = x => moment(x)

const gteNow = pipe(toMoment, x => x.isAfter())
const lteNow = pipe(gteNow, not)

const madeIrrigate = (io, date) => pipe(
  x  => ({date: new Date(x)}),
  find,
  map(nth(0)),
  map(prop('duration')),
  chain(irrigate(io)),
  chain(duration => log(`[MADE][/scheduler] kron irrigate {date: ${date}, duration: ${duration}}`))
)(date)



const emitIrrigate = curry((io, date) => {
  fork
    (e => console.log(`[ERROR][/scheduler] ${e}`))
    ((a)=> console.log(`[MADE][/scheduler] do a kron irrigation ${JSON.stringify(a)}`))
    (madeIrrigate(io, date))
})


const getIrrigation = irrigation =>{ 
  
  const cancel = Stream(observer => {
 
    const interval = irrigation && setInterval(() => {
      if(lteNow(irrigation)) {
        console.log(irrigation, '000000')
        observer.next(irrigation)
        observer.complete()
        clearInterval(interval)
      }
    }, 1000);

    cancelations.push(() => clearInterval(interval))
    return () => clearInterval(interval)
  })
  return cancel
}


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




const startWatch = file => Stream(subscriber => {
  log('[START][/scheduler] start changed json');
  fs.watchFile(file, () => {
    log('[UPDATE][/scheduler] json updated as read it');
    subscriber.next(file)
  })
  subscriber.next(file)
  return ()=> {}
})
const proc = pipe(
  startWatch,
  map(cancelPreviousProcess),
  chain(getIrrigations),
  map(getJsonDatesProp),
  map(filter(gteNow)),
  x => x.mergeMap(getIrrigation)
)

const scheduler = io => {
  proc(file).subscribe({
    next: date => emitIrrigate(io, date),
    error: _ => log('[ERROR][/scheduler] LOAD JSON DATA'),
    complete: _ => log('[END][/scheduler] LOADED DATA JSON')
  })
}

export const kron = io => 
  fork (()=> log('[ERROR] cant intialize kron')) (() => scheduler(io)) (updateKalendarDates(''))