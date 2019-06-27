const {tagged} = require('daggy');
const moment = require('moment-timezone');
const {of, map} = require('fantasy-land');

const DateI = tagged('DateI', 
  ['date']);
DateI[of] = value => DateI(value);

DateI.prototype[map] = DateI.prototype.map = function (f) {
  return new DateI(f(this.date))
}


module.exports = DateI;
