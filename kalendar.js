const moment = require('moment');
const fs = require('fs');

const madeKalendar = ({start, end, hour, minute}) => {
  const days = Math.abs(moment(start).diff(moment(end), 'days'));
  const dates = Array.from({length: days}, (_, i)=> {
    const day = moment(start).add(i, 'days').set({hour, minute});
  });
  try {
    return fs.writeFileSync('kalendar.json', {dates}, 'utf8', {mode: 0755});
  } catch(err) {
    return err;
  };
};

module.exports = {madeKalendar};