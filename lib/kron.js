const fs = require('fs');
const CronJob = require('cron').CronJob;
const moment = require('moment');
const url = 'http://micasitatucasita.com:3000'
const io = require('socket.io-client')(url);


const FILE = 'kalendar.json';
const DEFUALT_KALENDAR = {dates:[], configuration: {priority: 'dates'}};
const DEFAULT_SCHEDULER = "* * * * *"; //every minute 
let kalendar; 
let gotNextKal;
let job;// {stop: ()=> console.log('on')};

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
  if (moment(date1, 'YYYY-MM-DD HH:mm') > moment(date2, 'YYYY-MM-DD HH:mm')) return 1;
  if (moment(date1, 'YYYY-MM-DD HH:mm') < moment(date2, 'YYYY-MM-DD HH:mm')) return -1;
  return 0;
};
const irrigate = irrigation => {
  console.log(`${moment().format('DD-MM-YYYY HH:mm:ss')} (${process.pid}) so emit the event made riego`);
  io.emit('made riego', 'programado', irrigation.duration);
}
const throwShcdulerCron = kron => {
  job = new CronJob(kron, function() {
    console.log( `${moment().format('DD-MM-YYYY HH:mm:ss')} (${process.pid})  shduler(${kron}): ${moment().format('H:mm:ss')}`);
  });
  job.start();
};
const throwDateCron =  dates => index => {
  const date = moment(dates[index].date, 'YYYY-MM-DD HH:mm');
  console.log(`${moment().format('DD-MM-YYYY HH:mm:ss')} (${process.pid}) waiting for the next at `, dates[index].date);
  job = new CronJob(date, () => {
    irrigate(dates[index]);
    console.log(`${moment().format('DD-MM-YYYY HH:mm:ss')} (${process.pid})this irrigate at ${dates[index].date} is done`);
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

const isOverNow = ({date}) => moment(date, 'YYYY-MM-DD HH:mm') > moment()
const getRiegosOverNow = dates => dates.filter(isOverNow);
fs.watchFile(FILE, sheduler);
function sheduler () {
  const {dates = [], sheduler = DEFAULT_SCHEDULER, configuration: {priority}} = readerFile();
  console.log(`${moment().format('DD-MM-YYYY HH:mm:ss')} (${process.pid}) start scheduler/or resart if chage the json`);
  const riegos = getRiegosOverNow(dates);
  if(riegos.length && priority === 'dates') {
    useDates(riegos.sort(kalendarSort));
  } else {
    throwShcdulerCron(sheduler);
  }
};

module.exports =  {sheduler}
