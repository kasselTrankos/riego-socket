const fs = require('fs');
const CronJob = require('cron').CronJob;
const moment = require('moment');
const url = 'http://micasitatucasita.com:3000'
// const io = require('socket.io')(url);
var io = require('socket.io-client')(url);
const FILE = 'kalendar.json';
let kalendar; 
let gotNextKal;



const defaultScheduler = "* * * * *"; //every minute 
const gotDates = dates => Boolean(dates.length);
const got = arr => index => Boolean(arr[index]);
const get = arr => index => arr[index];
const getMoment = value => moment(value);
const notifyEnd = () => {console.log('hemos terminado, y no es normal o si?');};
const readerFile =  (file = FILE) => {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};
fs.watchFile(FILE, ()=> {
  sheduler();
});

const kalendarSort = (date1, date2)  => {
  if (moment(date1, 'YYYY-MM-DD HH:mm') > moment(date2, 'YYYY-MM-DD HH:mm')) return 1;
  if (moment(date1, 'YYYY-MM-DD HH:mm') < moment(date2, 'YYYY-MM-DD HH:mm')) return -1;
  return 0;
};
let job;
const irrigate = irrigation => {
  console.log(irrigation);
  io.emit('made riego', 'programado', irrigation.duration);
}
const throwShcdulerCron = kron => {
  job = new CronJob(kron, function() {
    console.log( `shduler(${kron}): ${moment().format('H:mm:ss')}`);
  });
  job.start();
};
const throwDateCron =  dates => index => {
  const date = moment(dates[index].date, 'YYYY-MM-DD HH:mm');
  console.log(date.format('DD-MM-YYYY HH:mm'), moment().toDate());
  job = new CronJob(date, () => {
    irrigate(dates[index]);
    console.log('cron is done');
    const next = ++index;
    gotNextKal(next)
      ? kalendar(next)
      : notifyEnd();
  });
 job.start();
};

const useDates = dates => {
  kalendar = throwDateCron(dates);
  gotNextKal = got(dates);
 
  kalendar(0);
};


const sheduler  = () => {
  const {dates, sheduler, configuration: {priority}} = readerFile();
  console.log('now is', new Date());
  if(job) {
    // console.log('jobs is exitrende')
    job.stop();
    // console.log(job);
  }
  if(gotDates(dates) && priority === 'dates') {
    const newDates = dates.filter(({date}) => moment(date, 'YYYY-MM-DD HH:mm') > moment()).sort(kalendarSort);
    useDates(newDates);
  } else {
    throwShcdulerCron(sheduler);
  }
};

module.exports =  {sheduler}
