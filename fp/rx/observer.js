function Observer(handler) {
  this.handler = handler;
  this.unsubscribed = false;
}

Observer.prototype.next = function (value) {
  if(!this.unsubscribed) {
    this.handler.next(value);
  }
}
Observer.prototype.complete = function() {
  if(!this.unsubscribed) {
    this.handler.complete();
  }
  this.unsubscribe();
}
Observer.prototype.error = function(e) {
  if (!this.unsubscribed) {
      this.handler.error(e)
  }
  this.unsubscribe()
}
Observer.prototype.unsubscribe = function() {
  this.unsubscribed = true

  if (this._unsubscribe) {
      this._unsubscribe()
  }
}

Observer.create = function(handler) {
  return new Observer(handler);
}


module.exports = Observer;