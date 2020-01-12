
import {date} from '@functional-lib/kalendar';
import Irrigation from '@functional-lib/irrigation';

const fs = require('fs');
const CronJob = require('cron').CronJob;

const url = 'http://micasitatucasita.com:3000'
const io = require('socket.io-client')(url);
const FILE = 'kalendar.json';
const DEFUALT_KALENDAR = {dates:[], configuration: {priority: 'dates'}};
const DEFAULT_SCHEDULER = "* * * * *"; //every minute 
const compose = (...fns) => x => fns.reduceRight((x, f) => f(x), x)
let job;
fs.watchFile(FILE, scheduler);
const IO = function(f) {
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
const kron = irrigate => f => new CronJob(date.of(irrigate.date).value, ()=> f(irrigate));
const kronJob = job => new IO(kron(job));

const got = arr => index => Boolean(arr[index]);
const notifyEnd = () => job.stop();
const readerFile =  (file = FILE) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch(error) {
    return DEFUALT_KALENDAR;
  }
};

const irrigate = value => {
  console.log(`${new Date()} (${process.pid}) so emit the event made riego`);
  io.emit('made riego', 'programado', value.duration);
  return value;
}
const throwScheduler = kron => {
  job = new CronJob(kron, () => 
    console.log( `${new Date()} (${process.pid})  scheduler(${kron})`)
  );
  job.start();
};

const throwDates =  dates => {
  const emit = irrigation => irrigate(irrigation);
  const getIndex = el => dates.indexOf(el);
  const addOne = value => value + 1;
  const next = index => got(dates)(index)
    ? madeIrrigate(index)
    : notifyEnd();
  // con un iterator y un while resuelves la mitad de los metodos  
  const madeIrrigate = (index = 0) => {
    console.log(`${new Date()} (${process.pid}) waiting for the next at `, dates[index].date);
    job = kronJob(dates[index]).map(compose(next, addOne, getIndex, emit)).start();
  } 
  madeIrrigate(0);
};

function scheduler () {
  const isOverNow = ({date:d}) => date.of(d).value > new Date();
  const {dates = [], scheduler = DEFAULT_SCHEDULER, configuration: {priority}} = readerFile();
  // if(!job) console.log(`${moment().format('DD-MM-YYYY HH:mm:ss')} (${process.pid}) start scheduler`);
  // console.log(`${moment().format('DD-MM-YYYY HH:mm:ss')} (${process.pid}) re-start scheduler changed json`);
  job && job.stop();
  const irrigations = Irrigation.from(dates).filter(isOverNow).sort().toArray();
  process.env.TZ = 'Europe/Madrid';

  (irrigations.length && priority === 'dates')
    ? throwDates(irrigations)
    : throwScheduler(scheduler);
};

module.exports =  {scheduler}
