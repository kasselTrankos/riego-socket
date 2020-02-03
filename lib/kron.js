
import Irrigation from '@functional-lib/irrigation';
import {Task, date as D} from './../fp';

const fs = require('fs');
const {CronJob, CronTime} = require('cron');

const url = 'http://micasitatucasita.com:3000'
const io = require('socket.io-client')(url);
const FILE = 'kalendar.json';
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)
const prop = key => o => o[key];
let job;
fs.watchFile(FILE, scheduler);

const irrigate = value => {
  console.log(`${new Date()} (${process.pid}) so emit the event made riego`);
  io.emit('made riego', 'programado', value.duration);
  return value;
}

const list = function _list(elms) {
  let items = elms;
  let last = 0;
  return {
    previous: last,
    items,
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


const kronIrrigations = job => dates => 
  new Task((reject, resolve)=> {
    job && job.stop();
    const d = dates.next();
    if(d) {
      job = new CronJob(D.of(d.date).value, ()=> resolve(job, dates));
      job.start();
    } else {
      reject('Empty dates for irrigation');
    }
  });




function scheduler () {
  const isOverNow = ({date:d}) => !D.of(d).lte(new Date());
  const toString = value => value.toString('utf-8');
  const decode = task => task.map(compose(Irrigation.from, prop('dates'), JSON.parse, toString));  
  if(!job) console.log(`${new Date()} (${process.pid}) start scheduler`);
  console.log(`${new Date()} (${process.pid}) re-start scheduler changed json`);
  decode(read(FILE))
    .map(d=> d.filter(isOverNow).sort().toArray()).map(list)
    .chain(kronIrrigations(job))
    .fork(console.log, (job, dates)=> {
      irrigate(dates.previous);
      const d  = dates.next(); //D.of(.date).value;
      if(d) {
        job.setTime(new CronTime(D.of(d.date).value));
        job.start();
      } else {
        job.stop();
      }
    });
}

module.exports =  {scheduler}
