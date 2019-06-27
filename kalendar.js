const Irrigation = require('./src/irrigation');
const moment = require('moment-timezone');
const fs = require('fs');
const FILE  = 'kalendar.json';
var uuid = require('uuid');

const getKalendar =  (file = FILE) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch(error) {
    return {dates: []};
  }
};
const fillKalendar = ({ start, end, hour, minute, duration}) => {
  const getDay = index => moment(start).add(index, 'days')
  const getDayFormat = day => day.format('YYYY-MM-DD');
  const getStrDate = index => getDay(index).set({hour, minute});
  const getObjectKalendar = (_, i) => ({
    date: getStrDate(i).tz('Europe/Madrid').format('YYYY-MM-DD HH:mm'),
    day: getDayFormat(getDay(i)),
    uuid: uuid.v1(),
    duration, hour, minute});

  const days = Math.abs(moment(start).diff(moment(end), 'days'));

  return Irrigation.from(Array.from({length: (days + 1)}, getObjectKalendar));
}
const write = (riegos, file = FILE) => {
  const json ={
    configuration: {
      priority: 'dates'
    },
    sheduler: "* * * * * *",
    dates: riegos.toArray()
  };
  try {
    fs.writeFileSync(file, JSON.stringify(json))
    return {message: 'update kalendar', status: true};
  } catch(err) {
    return {message: 'ko kalendar', status: false}
  };
}  
  
const madeKalendar = async (data = {}, file = FILE) => {
  if(!moment(data.start, 'YYYY-MM-DD', true).isValid()) {
    return {message: 'no need update', status: true};
  }
  const unique = current => riegos => riegos.contains(riego => current.date !== riego.date);
  const gotDates = ({dates}) => Boolean(dates && dates.length);
  const previous = getKalendar();
  const current = fillKalendar(data);
  const prev = Irrigation.from(gotDates(previous) ? previous.dates : [])
    .filter(item => unique(item)(current)); 
  const riegos = current.concat(prev).sort().filter(item => +new Date(item.date) > +new Date());
  return write(riegos);
};

module.exports = {madeKalendar, getKalendar};