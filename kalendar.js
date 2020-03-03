import Irrigation from '@functional-lib/irrigation';
import fs from 'fs';
import {date as D} from './fp/date';
import uuid from 'uuid';
import {prop} from './utils';
const FILE  = 'kalendar.json';

const getValue = prop('value');
const setMinutes = value => d => d.setMinutes(value);
const setHours = value => d => d.setHours(value);
const setSeconds = value => d => d.setSeconds(value);


const getKalendar =  (file = FILE) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch(error) {
    return {dates: []};
  }
};

const getArrayRiegosList = ({ dates = [], irrigation: {time: {hour, minute, second}, duration}}) => {
  return dates.map(d => ({
    date: D.of(d).map(setHours(hour)).map(setMinutes(minute)).map(setSeconds(second)).value,
    day: d,
    uuid: uuid.v1(),
    duration, hour, minute, second,
  }));
}

const write = (riegos, file = FILE) => {
  const json ={
    configuration: {
      priority: 'dates'
    },
    sheduler: "* * * * * *",
    dates: riegos
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

const _made = (data = {}) => {
  const overNow = item => +new Date(item.date) > +new Date();
  const previous = getKalendar();
  const current = getArrayRiegosList(data);
  const riegos = current.concat(prop('dates')(previous) || []).filter(overNow);
  
  return write(riegos)
}

const madeKalendar = async (data = {}, file = FILE) => _made(data);


module.exports = {madeKalendar, getKalendar, deleteIrrigation, getArrayRiegosList};