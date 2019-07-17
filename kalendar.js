const Irrigation = require('./src/irrigation');
const moment = require('moment-timezone');
const fs = require('fs');
const uuid = require('uuid');
const FILE  = 'kalendar.json';


const getKalendar =  (file = FILE) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch(error) {
    return {dates: []};
  }
};
const getDiffDays = start => end => Math.abs(moment(start).diff(moment(end), 'days'));

const getArrayRiegosList = ({ start, end, hour, minute, duration}) => {
  const getDay = index => moment(start).add(index, 'days');
  const getDayFormat = day => day.format('YYYY-MM-DD');
  const getStrDate = index => getDay(index).set({hour, minute});
  const getObjectKalendar = (_, i) => ({
    date: getStrDate(i).format('YYYY-MM-DD HH:mm'),
    day: getDayFormat(getDay(i)),
    uuid: uuid.v1(),
    duration, hour, minute});

  const days = getDiffDays(start)(end);
  return Array.from({length: (days + 1)}, getObjectKalendar);
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
    const data = fs.writeFileSync(file, JSON.stringify(json));
    return {message: 'update kalendar', status: true, json};
  } catch(err) {
    return {message: 'ko kalendar', status: false}
  };
}

const deleteIrrigation = uuid => {
  const dates = getKalendar();
  const deleteByUuid = item => !item.uuid!== uuid;
  const riegos = Irrigation.from(dates).filter(deleteByUuid)
  // console.log(riegos.toArray(), ' lo habre quitado', uuid);
  // return write(riegos);
}
  
const madeKalendar = async (data = {}, file = FILE) => {
  if(!moment(data.start, 'YYYY-MM-DD', true).isValid()) {
    return {message: 'no need update', status: true};
  }
  const filterFromNow = item => +new Date(item.date) > +new Date();
  const unique = current => riegos => riegos.contains(riego => {
    return current.date !== riego.date
  });
  const gotDates = ({dates}) => Boolean(dates && dates.length);
  const previous = getKalendar();
  
  const current = Irrigation.from(getArrayRiegosList(data));
  const prev = Irrigation.from(gotDates(previous) ? previous.dates : [])
  const uniqueRiegos = prev.filter(item => unique(item)(current)); 
  const riegos = current.concat(uniqueRiegos).sort().filter(filterFromNow);
  
  return write(riegos)
};

module.exports = {madeKalendar, getKalendar, deleteIrrigation, getDiffDays, getArrayRiegosList};