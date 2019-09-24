const Irrigation = require('@functional-lib/irrigation');
import {diffDays, addDays} from  '@functional-lib/kalendar';

const compose = (...fncs) => x => fncs.reduce((acc, f) => f(acc), x); 
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

const getArrayRiegosList = ({ start, end, hour, minute, duration}) => {
  const toDate = value => new Date(value);
  const setHour = value => toDate(value).setHours(+hour);
  const setMinute = value => toDate(value).setMinutes(+minute);
  const getDate = index => toDate(addDays(toDate(start))(index));
  const setTime = value => compose(setHour, toDate, setMinute)(value);
  const formatZero = value => value <= 9 ? `0${value}` : value;
  const day = value => formatZero(toDate(value).getDate()); 
  const month = value => formatZero(toDate(value).getMonth() + 1); 
  const format = value => `${toDate(value).getFullYear()}-${month(value)}-${day(value)}`;
  const getObjectKalendar = (_, index) => ({
    date: `${format(toDate(setTime(getDate(index))))} ${hour}:${minute}`,
    day: format(toDate(setTime(getDate(index)))),
    uuid: uuid.v1(),
    duration, hour, minute});

  
  return Array.from({length: diffDays(start)(end) + 1}, getObjectKalendar);
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
    fs.writeFileSync(file, JSON.stringify(json));
    return {message: 'update kalendar', status: true, json, dates: json.dates};
  } catch(err) {
    return {message: 'ko kalendar', status: false}
  };
}

const deleteIrrigation = uuid => {
  const {dates} = getKalendar();
  const deleteByUuid = item => item.uuid !== uuid;
  const riegos = Irrigation.from(dates).filter(deleteByUuid);
  return write(riegos);
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

module.exports = {madeKalendar, getKalendar, deleteIrrigation};