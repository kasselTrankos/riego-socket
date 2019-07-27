const {tz, getDate} = require('./utils/date.utils');
const m = {
    "date": "2019-07-31 09:20",
    "day": "2019-07-31",
    "uuid": "33768ce5-afcb-11e9-90e4-0b3cce54a6dc",
    "duration": 79,
    "hour": "09",
    "minute": 20
};
const d = getDate(m);

console.log(d,tz(d), tz(new Date()));