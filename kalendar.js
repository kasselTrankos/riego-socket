const moment = require('moment');
const fs = require('fs');
const writeJsonFile = require('write-json-file');
const FILE  = 'kalendar.json';

const readerFile =  (file = FILE) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch(error) {
    return {dates: []};
  }
};
const unique = arr => [...new Set(arr.map(item => JSON.stringify(item)))].map(item => JSON.parse(item) );
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
  const getStrDate = index => moment(start).add(index, 'days').set({hour, minute});
  const getDate = (_, i) => ({date: getStrDate(i), duration});
  const previous = readerFile();
  const previousDates = gotDates(previous) ? previous.dates : []; 
  const days = Math.abs(moment(start).diff(moment(end), 'days'));
  const newDates = Array.from({length: (days + 1)}, getDate);
  const combinedDates = [...previousDates, ...newDates]; 
  // console.log(previous.dates, 'nerw', newDates, 'combni', combinedDates);
  const dates = unique(combinedDates.filter(({date}) => moment(date) >= moment()).sort(sortDates));
  console.log(dates, 'DATES LLL');

  try {
    const json ={
      configuration: {
        priority: 'dates'
      },
      sheduler: "* * * * * *",
      dates
    };
    fs.writeFileSync(file, JSON.stringify(json))
    // await writeJsonFile(file, json);
    return {message: 'update kalendar', status: true};
  } catch(err) {
    return {message: 'ko kalendar', status: false}
  };
};

module.exports = {madeKalendar};