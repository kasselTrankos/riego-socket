// kalendar
const { fork } = require('fluture')
const { updateOne, find, deleteOne } = require('../src/irrigations')
const R = require('ramda')
const { S } = require('../helpers/sanctuary')
const { writeFile, jsonToString, setDates} = require('../lib/kalendar')
const { setLoggerPostKalendar,
  setLoggerPostIrrigate,
  setLoggerGetKalendar,
  setLoggerDeleteKalendar } = require('../log')
const {kalendar: { file}} = require('../config')
const { irrigate } = require('../lib/mqttclient') 
const { prop, toNumber } = require('../utils')

const toDate = x => new Date(x)
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
        S.pipe([
          S.chain(()=> find({date: {$gte: new Date()}})),
          S.map(S.pipe([S.map(prop('date')), setDates, jsonToString])),
          R.chain(writeFile(file))
        ]),
        S.map(() => prop ('$set') (prop('1')(o))),
      ])(o),
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

  const getNext = x => console.log(x) ||  x.lenght ? x[0] : []
  // get :: nextIrrigate
  app.get('/nextIrrigate', (req, res)=> {
    const proc = S.pipe([
      find,
      S.map(getNext),
      S.chain(setLoggerGetKalendar),
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
      S.map(x => ({deleted: true})),
    ])
    fork (console.error) (x => res.send(x) ) (proc(req))
  })
} 