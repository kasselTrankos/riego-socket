import Irrigation from '@functional-lib/irrigation';
import {diffDays, addDays, date} from  '@functional-lib/kalendar';
import fs from 'fs';
import uuid from 'uuid';

const FILE  = 'kalendar.json';

const prop = key => obj => obj[key];
const getValue = prop('value');
const compose = (...fncs) => x => fncs.reduceRight((acc, f) => f(acc), x); 

const getKalendar =  (file = FILE) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch(error) {
    return {dates: []};
  }
};

const getArrayRiegosList = ({ start, end, hour, minute, duration}) => {
  const zero = value => value <= 9 ? `0${value}` : value;
  const getDay = d => date(d).map(x => x.getDate());
  const getMonth = d => date(d).map(x => x.getMonth() + 1);
  const day = d => compose(zero, getValue, getDay)(d); 
  const month = d => compose(zero, getValue, getMonth)(d);
  const year = d => date.of(d).value.getFullYear();
  const minutes = d => d.setMinutes(minute);
  const hours = d => d.setHours(hour);
  const add = i => d => addDays(date.of(d).value)(i);
  const format = d => `${year(d)}-${month(d)}-${day(d)}`;

  const get = i => date(start)
    .map(add(i))
    .chain(hours).map(compose(getValue, date.of))
    .chain(minutes).map(compose(getValue, date.of))
    .chain(format);

  const getObjectKalendar = (_, index) => ({
    date: `${compose(getValue, get)(index)} ${hour}:${minute}`,
    day: compose(getValue, get)(index),
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
  const getTime = d => d.getTime();
  const isValid = getValue(date.of(data.start).map(getTime)) > 0;
  if(!isValid) {
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