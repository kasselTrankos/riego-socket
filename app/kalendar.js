// kalendar
const { fork, resolve, chain, alt } = require('fluture')
const { insertIrrigation, irrigations } = require('../src/irrigations')
const { safeIsEmpty, eitherToFuture, prop } = require('../utils')
const { config } = require('../config')
const R = require('ramda')
const { S } = require('../helpers/sanctuary')
const ObjectID = require('mongodb').ObjectID

const { pipe, map, Pair, fst, snd } = S 
const toNumber = x => Number(x)
const toDate = x => new Date(x)


export const initializeKalendar = app => {
	app.post('/kalendar/:date/:duration', (req, res)=> {
		const proc = pipe([
			prop('params'),
      R.converge(
        (date, duration) => ({date, duration}),
        [
          R.pipe(prop('date'), toNumber, toDate),
          R.pipe(prop('duration'), toNumber)
        ]
      ),
      o => pipe([
        _ => insertIrrigation({date: o.date}, {$set: o}, {upsert: true}),
        S.map( _ => o)
      ])(o)
		])

		fork(x => res.json( {error: true})) (x => res.json(x)) (proc(req))
	})



	// post :: kalendar
  app.get('/kalendar', (req, res)=> {
    fork (console.error) (x => res.send(x) ) (irrigations())
  })

app.delete('/kalendar/:uuid', (req, res)=> {
	const {uuid} = req.params
	const {dates}  = deleteIrrigation(uuid)
	res.json(dates)
})
} 