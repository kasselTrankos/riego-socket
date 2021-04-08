const fs = require('fs');
const { fork } = require('fluture')
const { compose, pipe, curry, map, chain, filter, prop, nth } = require('ramda')
const Stream  = require('../fp/stream')
const { irrigate } = require ('../lib/mqttclient')
const { kalendar : { file }} = require('../config')
const { logger } = require('../utils/log.utils')
const { updateKalendarDates } = require('../lib/kalendar')
const { find } = require('../src/irrigations')
const { toString, gteNow, lteNow, toDate } = require('../utils')

const cancelations = []


// log :: String -> *
const log = msg => fork (console.error) (console.log) (logger(msg))

// getJsonDatesProp :: Buffer -> [] 
const getJsonDatesProp = compose(
  prop('dates'),
  JSON.parse,
  toString
)

// madeIrrigate :: Socket -> String -> Future * Error
const madeIrrigate = (io, date) => pipe(
  toDate,
  x  => ({date: x}),
  find,
  map(nth(0)),
  map(prop('duration')),
  chain(irrigate(io)),
  chain(duration => logger(`[MADE][/scheduler] kron irrigate {date: ${date}, duration: ${duration}}`))
)(date)
  
// emitIrrigate :: Socket -> String -> *
const emitIrrigate = curry((io, date) => {
  fork
  (e => console.log(`[ERROR][/scheduler] ${e}`))
  ((a)=> console.log(`[MADE][/scheduler] do a kron irrigation ${JSON.stringify(a)}`))
  (madeIrrigate(io, date))
})

// getIrrigations :: String -> Stream 
const getIrrigations = fileName => new Stream(subscriber => {
  let _continue = true
  fs.readFile(fileName, (err, data) => { 
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

// getIrrigation :: String -> Stream 
const getIrrigation = date =>{ 
  const cancel = Stream(observer => {
    const interval = date && setInterval(() => {
      if(lteNow(date)) {
        observer.next(date)
        observer.complete()
        clearInterval(interval)
      }
    }, 1000);
    
    cancelations.push(() => clearInterval(interval))
    return () => clearInterval(interval)
  })
  return cancel
}
  
const cancelPreviousProcess = x => {
  cancelations.map(f => f())
  return x
}
  
// startWatch :: String -> Stream
const startWatch = fileName => Stream(subscriber => {
  log('[START][/scheduler] start changed json');
  fs.watchFile(fileName, () => {
    log('[UPDATE][/scheduler] json updated as read it');
    subscriber.next(fileName)
  })
  subscriber.next(fileName)
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