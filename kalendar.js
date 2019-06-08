const moment = require('moment');
const fs = require('fs');

const madeKalendar = ({start, end, hour, minute, duration}) => {
  const days = Math.abs(moment(start).diff(moment(end), 'days'));
  const dates = Array.from({length: days}, (_, i)=> {
    return  moment(start).add(i, 'days').set({hour, minute});
  });
  try {
    const json ={
      configuration: {
        priority: 'dates'
      },
      sheduler: "* * * * * *"
    };
    fs.writeFileSync('kalendar.json', JSON.stringify(Object.assign({}, json, {dates, duration})), 'utf8', {mode: 0755});
    return {message: 'update kalendar', status: true};
  } catch(err) {
    return {message: 'ko kalendar', status: false}
  };
};

module.exports = {madeKalendar};