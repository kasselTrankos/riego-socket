const {tagged} = require('daggy');
const {empty, of, concat} = require('fantasy-land');

const Riego = tagged('Riego', ['date', 'duration', 'hour', 'minute', 'active']);
Riego[of] = value => Riego(value);
Riego[empty] = () => Riego({active: false});
Riego.prototype[concat] = function(that) {
  const formatZero = value => value <= 9 ? `0${value}` : value;
  /// here is shouting chain !!!! please become a chain man!!!
  const thatDate = new Date(new Date(new Date(that.date).setHours(that.hour)).setMinutes(that.minute));
  const thisDate = new Date(new Date(new Date(this.date).setHours(this.hour)).setMinutes(this.minute));
  const validDate = thatDate >= thisDate ? thatDate : thisDate;
  const date = `${validDate.getFullYear()}-${formatZero(validDate.getMonth() + 1)}-${formatZero(validDate.getDate())}`;
  const duration = that.duration + this.duration;
  const hour = validDate.getHours();
  const minute = validDate.getMinutes();
  return Riego(date, duration, hour, minute, true);
}
module.exports = Riego;
