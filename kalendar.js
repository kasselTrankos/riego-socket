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
const unique = arr => [...new Set(arr.map(item => JSON.stringify(item)))].map(item => JSON.parse(item));
const sortDates = (date1, date2)  => {
  if (new Date(date1.date) > new Date(date2.date)) return 1;
  if (new Date(date1.date) < new Date(date2.date)) return -1;
  return 0;
};
const gotDates = ({dates}) => dates && Boolean(dates.length);

const madeKalendar = async ({start, end, hour, minute, duration}, file = FILE) => {
  if(!moment(start, 'YYYY-MM-DD', true).isValid()) {
    return {message: 'no need update', status: true};
  }
  const getDay = index => moment(start).add(index, 'days')
  const getDayFormat = day => day.format('YYYY-MM-DD');
  const getStrDate = index => getDay(index).set({hour, minute});
  const getObjectKalendar = (_, i) => ({
    date: getStrDate(i).tz('Europe/Madrid').format('YYYY-MM-DD HH:mm'),
    day: getDayFormat(getDay(i)),
    uuid: uuid.v1(),
    duration, hour, minute});
  const isOverEqualNow = ({date}) => moment(date) >= moment();
  const previous = getKalendar();
  const previousDates = gotDates(previous) ? previous.dates : []; 
  const days = Math.abs(moment(start).diff(moment(end), 'days'));
  const newDates = Array.from({length: (days + 1)}, getObjectKalendar);
  const combinedDates = [...previousDates, ...newDates]; 
  const dates = unique(combinedDates.filter(isOverEqualNow).sort(sortDates));

  try {
    const json ={
      configuration: {
        priority: 'dates'
      },
      sheduler: "* * * * * *",
      dates
    };
    fs.writeFileSync(file, JSON.stringify(json))
    return {message: 'update kalendar', status: true};
  } catch(err) {
    return {message: 'ko kalendar', status: false}
  };
};

module.exports = {madeKalendar, getKalendar};