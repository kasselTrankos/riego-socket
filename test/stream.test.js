// stream.test
const { sub } = require('sanctuary')
const Stream = require('../fp/stream')

describe('Stream', () => {
  it('chain', ()=> {
    const a = Stream.of(3)
    const f = x => Stream.of(x + 1)
    const g = x => Stream.of(x + 3)
    a.chain(f).chain(g).subscribe({next: x => 
      expect(x).toEqual(7)
    })
    a.chain(x => f(x)).chain(g).subscribe({next: x => 
      expect(x).toEqual(7)
    })
  })
  it('concat(sequence)',  done => {
    const a = Stream.of('00')
    const b = Stream.of('cc')
    const c = t => Stream(subscriber => {
      const timeout = setTimeout(()=> {
        subscriber.next(`c(${t})`)
        subscriber.complete()
      }, t)
      return () => clearTimeout(timeout)
    })
    let count = 0;
    
    const cancel = c(100)
      .concat(c(400))
      .concat(c(500)).subscribe({
        next: x => {
          count ++
          if(count === 1) {
            expect(x).toEqual('c(100)')
          }
          if(count === 2) {
            expect(x).toEqual('c(400)')
          }
          if(count === 3) {
            expect(x).toEqual('c(500)')
          }
        },
        complete: done
      })
  })
  it('concatMap(sequence)',  done => {
    const a = Stream.of('00')
    const b = Stream.of('cc')
    const c = t => Stream(subscriber => {
      const timeout = setTimeout(()=> {
        subscriber.next(`c(${t})`)
        subscriber.complete()
      }, t)
      return () => clearTimeout(timeout)
    })
    let count = 0;
    const iters = [600, 100, 200, 400]
    const cancel = Stream.of(iters)
      .concatMap(c)
      .subscribe({
        next: x => {
          expect(x).toEqual(`c(${iters[count]})`)
          count ++
        },
        complete: done
      })
  })
  it('mergeMap(parallel)',  done => {
    const a = Stream.of('00')
    const b = Stream.of('cc')
    const c = t => Stream(subscriber => {
      const timeout = setTimeout(()=> {
        subscriber.next(`c(${t})`)
        subscriber.complete()
      }, t)
      return () => clearTimeout(timeout)
    })
    let count = 0;
    const iters = [600, 100, 300, 400]
    const expected = [100, 300, 400, 600]
    const cancel = Stream.of(iters)
      .mergeMap(c)
      .subscribe({
        next: x => {
          expect(x).toEqual(`c(${expected[count]})`)
          count ++
        },
        complete: done
      })
  })
})