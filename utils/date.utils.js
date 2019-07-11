const compose = fa => fb => x => fa(fb(x));
const add = a => b => a + b;
const timezone = () => 120 * 60 * 1000;

const midnight = date => new Date(date.setHours(0,0,0,0));
const cast = date => +new Date(date);
const tz = date => new Date(date.getTime() +  timezone())
const moveToDate = (date = new Date) => diff => new Date(date.setDate(diff));
const toDay = date => Math.abs(Math.round(date / (1000 *60*60*24)));
const clone = date => new Date(date.getTime());
const getDate = date => {
  const [year, month, day] = date.day.split('-');
  const {hour = 0, minute = 0} = date;
  return new Date(year, month - 1, day, hour, minute, 0);
}
const plusDays = days => (date = new Date()) => 
  new Date(clone(date).setDate(date.getDate() + days));


  module.exports = {tz, timezone, add};