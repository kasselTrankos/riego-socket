const {taggedSum} = require('daggy');
const Option = taggedSum('Option', {
  Some: ['x', 'y'],
  None: [],
})
Option.prototype.map = function (f) {
  return this.cata({
    Some: (x, y) => Option.Some(f(x), y),
    None: () => this,
  })
}
module.exports = Option