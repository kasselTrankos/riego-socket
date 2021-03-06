// kalendar
const { fork } = require('fluture')
const R = require('ramda')
const { S } = require('../helpers/sanctuary')
const { updateKalendarDates } = require('../lib/kalendar')
const { setLoggerPostKalendar,
  setLoggerPostIrrigate,
  setLoggerGetKalendar,
  setLoggerDeleteKalendar,
  setLoggerGetNextIrrigate } = require('../log')
const { updateOne, find, deleteOne } = require('../src/irrigations')
const { irrigate, updateNextIrrigate } = require('../lib/mqttclient') 
const { prop, toNumber, toDate } = require('../utils')

const toBoolean = x => x === 'true' ? true : false



export const initializeKalendar = (io, app) => {

	app.post('/kalendar', (req, res)=> {
		const proc = S.pipe([
			prop('body'),
      R.converge(
        (date, duration) => [{date}, {$set: {date, duration}}, {upsert: true}],
        [
          S.pipe([prop('date'), toNumber, toDate]),
          S.pipe([prop('duration'), toNumber])
        ]
      ),
      o => S.pipe([
        R.apply(updateOne),
        S.chain(updateKalendarDates),
        S.map(() => prop ('$set') (prop('1')(o))),
      ])(o),
      S.chain(updateNextIrrigate),
      S.chain(setLoggerPostKalendar),
		])

		fork(x => res.json( {error: true})) (x => res.json(x)) (proc(req))
	})
  app.post('/irrigate', (req, res)=> {
    const proc = S.pipe([
      prop('body'),
      prop('duration'),
      x => String(x),
      irrigate(io),
      S.chain(setLoggerPostIrrigate),
    ])
    fork (console.error) (x => res.send(x) ) (proc(req))
	})

  // put :: /kalendar/:date/:duration/:irrigated
  app.put('/kalendar/:date/:duration/:irrigated', (req, res)=> {
		const proc = S.pipe([
			prop('params'),
      R.converge(
        (date, duration, irrigated) => [{date}, {$set: {date, duration, irrigated}}, {upsert: true}],
        [
          S.pipe([prop('date'), toNumber, toDate]),
          S.pipe([prop('duration'), toNumber]),
          S.pipe([prop('irrigated'), toBoolean])
        ]
      ),
      o => S.pipe([
        R.apply(updateOne),
        S.map(x => prop ('$set') (prop('1')(o)))
      ])(o)
		])

		fork(x => res.json( {error: true})) (x => res.json(x)) (proc(req))
	})

	// post :: kalendar/:date
  app.get('/kalendar/:date', (req, res)=> {
    const proc = S.pipe([
      prop('params'),
      S.pipe([prop('date'), toNumber, toDate, date => ({date})]),
      find
    ])
    fork (console.error) (x => res.send(x) ) (proc(req))
  })
  
  // get :: kalendar
  app.get('/kalendar', (req, res)=> {
    const proc = S.pipe([
      find,
      S.chain(setLoggerGetKalendar),
    ])
    fork (console.error) (x => res.send(x) ) (proc({date: {
      $gte: new Date()
    }}))
  })

  // getNext :: [{}] ->  {}
  const getNext = x => x.length ? x[0] : {}

  // get :: nextIrrigate
  app.get('/nextIrrigate', (req, res)=> {
    const proc = S.pipe([
      find,
      S.map(getNext),
      S.chain(setLoggerGetNextIrrigate),
    ])
    fork (console.error) (x => res.send(x) ) (proc({date: {
      $gte: new Date()
    }}))
  })

  // delete :: kalendar/:date
  app.delete('/kalendar', (req, res)=> {
    const proc = S.pipe([
      prop('body'),
      prop('date'),
      toNumber,
      toDate,
      setLoggerDeleteKalendar,
      S.chain(deleteOne),
      S.chain(updateNextIrrigate),
      S.chain(updateKalendarDates),
      S.map(() => ({deleted: true})),
    ])
    fork (console.error) (x => res.send(x) ) (proc(req))
  })
} 