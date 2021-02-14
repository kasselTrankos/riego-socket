// kalendar
const { fork } = require('fluture')
const { updateOne, find, deleteOne } = require('../src/irrigations')
const { prop, toNumber } = require('../utils')
const R = require('ramda')
const { S } = require('../helpers/sanctuary')
const { writeFile, jsonToString, setDates} = require('../lib/kalendar')
const {kalendar: { file}} = require('../config')

const toDate = x => new Date(x)
const toBoolean = x => x === 'true' ? true : false



export const initializeKalendar = app => {
	app.post('/kalendar/:date/:duration', (req, res)=> {
		const proc = S.pipe([
			prop('params'),
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
        S.map(x => prop ('$set') (prop('1')(o))),
      ])(o),
		])

		fork(x => res.json( {error: true})) (x => res.json(x)) (proc(req))
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
  
  // post :: kalendar/:date
  app.get('/kalendar', (req, res)=> {
    fork (console.error) (x => res.send(x) ) (find({date: {
      $gte: new Date()
    }}))
  })

  // delete :: kalendar/:date
  app.delete('/kalendar/:date', (req, res)=> {
    const proc = S.pipe([
      prop('params'),
      prop('date'),
      toNumber,
      toDate,
      deleteOne,
      S.map(x => ({deleted: true}))
    ])
    fork (console.error) (x => res.send(x) ) (proc(req))
  })
} 