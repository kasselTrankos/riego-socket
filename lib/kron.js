
import {date as D} from './../fp/date';
import Irrigation from '@functional-lib/irrigation';
import {Task} from './../fp/io';
import { get } from 'http';

const fs = require('fs');
const {CronJob, CronTime} = require('cron');

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

const list = function _list(elms) {
  let items = elms;
  let last = 0;
  return {
    previous: last,
    next: () => {
      const [head, ...tail] = items;
      last = head;
      items = tail;
      return head;
    }
  }
}
const read = file => {
  return new Task((reject, resolve)=> {
    fs.readFile(file, (error, data)=> {
      if (error)  reject(error)
      else        resolve(data)
    });
  });
}
const decode = task => task.map(buffer => buffer.toString('utf-8'));
const kron =  date => {
  job && job.stop();
  return new Task((_, resolve)=> {
    job = new CronJob(date, ()=> resolve(job));
    job.start();
  });
};

const throwDates = dates => {
  const t = dates.next();
  const getDate = (d) => D.of(d.date).value;
  ///shut a maybe here
  if(t) {
    kron(getDate(t)).fork(console.log, (job)=> {
      irrigate(dates.previous);
      const time  = dates.next();
      if(time) {
        job.setTime(new CronTime(getDate(time)));
        job.start();
      } else {
        job.stop();
      }
    }) 
  }
};


function scheduler () {
  const isOverNow = ({date:d}) => !D.of(d).lte(new Date());
  const {dates = [], scheduler = DEFAULT_SCHEDULER, configuration: {priority}} = readerFile();
  // const da = decode(read(FILE)).fork(console.log, console.log);
  // console.log(da)
  if(!job) console.log(`${new Date()} (${process.pid}) start scheduler`);
  console.log(`${new Date()} (${process.pid}) re-start scheduler changed json`);
  const irrigations = Irrigation.from(dates).filter(isOverNow).sort().toArray();
  process.env.TZ = 'Europe/Madrid';
  
  throwDates(list(irrigations));
}

module.exports =  {scheduler}
