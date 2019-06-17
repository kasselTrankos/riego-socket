const {tagged} = require('daggy');
const {empty, of, concat, equals} = require('fantasy-land');

const Riego = tagged('Riego', ['date', 'duration', 'hour', 'minute', 'active']);
Riego[of] = value => Riego(value);
Riego[empty] = () => Riego(new Date('1900-01-01'), 0, 0, 0, false);
Riego.prototype[equals] = function(that) {
  return [+new Date(this.date) === +new Date(that.date),
    this.duration === that.duration,
    this.hour === that.hour, this.minute === that.minute].every(Boolean);
};
Riego.prototype[concat] = function(that) {
  /// here is shouting chain !!!! please become a chain man!!!
  const thatDate = new Date(new Date(new Date(that.date).setHours(that.hour)).setMinutes(that.minute));
  const thisDate = new Date(new Date(new Date(this.date).setHours(this.hour)).setMinutes(this.minute));
  const isGteDateThat = thatDate >= thisDate;
  const validDate = isGteDateThat ? thatDate : thisDate;
  const date = isGteDateThat ? that.date : this.date;
  const duration = +that.duration + +this.duration;
  
  const hour = isGteDateThat ? that.hour : this.hour;
  const minute = isGteDateThat ? that.minute : this.minute;
  const active = this.active || that.active;
  return Riego(date, duration, hour, minute, active);
}
module.exports = Riego;
