function Subscription(unsubscribe) {
  this.unsubscribe = unsubscribe;
}
Subscription.create = function(unsubscribe){
  return new Subscription(unsubscribe)
}
module.exports = Subscription;