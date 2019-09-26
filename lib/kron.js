
import {date} from '@functional-lib/kalendar';
const fs = require('fs');
const CronJob = require('cron').CronJob;
const moment = require('moment');
const {tz, getDate} = require('./../utils/date.utils');

const url = 'http://micasitatucasita.com:3000'
const io = require('socket.io-client')(url);
const compose = (...fns) => x => fns.reduceRight((x, f) => f(x), x)
const kj = d => f => new CronJob(d, f);
let job;
var IO = function(f) {
  this.value = f;
};
IO.prototype.map = function(f) {
  return new IO(this.value(f))
}
IO.prototype.stop = function() {
  this.value.stop()
  return new IO(this.value);
};
IO.prototype.start = function () {
  this.value.start();
  return new IO(this.value);
}
const kronJob = d => new IO(kj(d));
const FILE = 'kalendar.json';
const DEFUALT_KALENDAR = {dates:[], configuration: {priority: 'dates'}};
const DEFAULT_SCHEDULER = "* * * * *"; //every minute 

const got = arr => index => Boolean(arr[index]);
const notifyEnd = () => job.stop();
const readerFile =  (file = FILE) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch(error) {
    return DEFUALT_KALENDAR;
  }
};
const kalendarSort = (date1, date2)  => {
  if(+tz(getDate(date1)) > +tz(getDate(date2))) return 1; 
  if(+tz(getDate(date1)) < +tz(getDate(date2))) return -1; 
  return 0;
};
const irrigate = value => {
  console.log(`${new Date()} (${process.pid}) so emit the event made riego`);
  io.emit('made riego', 'programado', value.duration);
  return value;
}
const throwShcdulerCron = kron => {
  job = new CronJob(kron, function() {
    console.log( `${new Date()} (${process.pid})  scheduler(${kron})`);
  });
  job.start();
};

/// pide a gritos un generator!!!!, me suena a que es una composicion de funciones, no lo veoooo
const throwDateCron =  dates => {
  const emit = irrigation => irrigate(irrigation);
  const getIndex = el => dates.indexOf(el);
  const addOne = value => value + 1;
  const next = index => got(dates)(index)
    ? madeIrrigate(index)
    : notifyEnd();
  const madeIrrigate = (index = 0) => {
    const d = date.of(dates[index].date).value;
    console.log(`${new Date()} (${process.pid}) waiting for the next at `, dates[index].date);
    job = kronJob(d).map(()=> compose(next, addOne, getIndex, emit)(dates[index])).start();
  } 
  madeIrrigate(0);
};

const useDates = dates => {
  throwDateCron(dates);
};

const isOverNow = date => +tz(getDate(date)) > +tz(new Date())
const getRiegosOverNow = dates => dates.filter(isOverNow);
fs.watchFile(FILE, sheduler);
function sheduler () {
  const {dates = [], sheduler = DEFAULT_SCHEDULER, configuration: {priority}} = readerFile();
  // if(!job) console.log(`${moment().format('DD-MM-YYYY HH:mm:ss')} (${process.pid}) start scheduler`);
  // console.log(`${moment().format('DD-MM-YYYY HH:mm:ss')} (${process.pid}) re-start scheduler changed json`);
  job && job.stop();
  const riegos = getRiegosOverNow(dates);
  process.env.TZ = 'Europe/Madrid';

  if(riegos.length && priority === 'dates') {
    useDates(riegos.sort(kalendarSort));
  } else {
    throwShcdulerCron(sheduler);
  }
};

module.exports =  {sheduler}
