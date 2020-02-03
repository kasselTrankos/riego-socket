import Observer from './observer';

function Observable(subscribe) {
  this._subscribe = subscribe; 
}

Observable.prototype.subscribe = function(handler) {
  const observer = Observer.create(handler);
  const unsubscribedHandler = this._subscribe(observer);
  observer.__unsubscribe = unsubscribedHandler;
  return Subscription.create(unsubscribedHandler);
}

Observable.create = function(subscribe) {
  return new Observable(subscribe);
}
Observable.prototype.pipe = function(...operators) {
  return operators.reduce((stream, operator) => operator(stream), this)
}

Observable.from = function(xs) {
  return new Observable(observer => {
      xs.forEach(x => observer.next(x))
      observer.complete()
      return () => {
          /* unsubscribed*/
      }
  })
}

Observable.fromEvent = function(event, ee) {
  return new Observable(observer => {
    const onNext = x => observer.next(x)
    const onError = e => observer.next(e)
    const onFinish = () => observer.complete()

    ee.addListener(event, onNext)
    ee.addListener('error', onError)
    ee.addListener('finish', onFinish)

    return () => {
      ee.removeListener(event, onNext)
      ee.removeListener('error', onError)
      ee.removeListener('finish', onFinish)
    }
  })
}

Observable.sequence = function(generator, ms) {
  const it = generator()

  return new Observable(observer => {
      const id = setInterval(() => {
          observer.next(it.next())
      }, ms)

      return () => clearInterval(id)
  })
}



module.exports = Observable;