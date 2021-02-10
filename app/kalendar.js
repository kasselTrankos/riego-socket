// kalendar
const { fork, resolve, chain, alt } = require('fluture')
const { insertIrrigation, irrigations } = require('../src/irrigations')
const { safeIsEmpty, eitherToFuture, prop } = require('../utils')
const { config } = require('../config')
const { S } = require('../helpers/sanctuary')

const { pipe, map, Pair, fst, snd } = S 


export const initializeKalendar = app => {
	app.put('/kalendar/:date/:duration', (req, res)=> {
		const proc = pipe([
			prop('params'),
			x => Pair(Number(prop('date')(x))) (x),
			map(prop('duration')),
			map(x => Number(x)),
			p => insertIrrigation(fst(p)) (snd(p)),
			map(prop('ops')),
			map(prop('0'))

		])

		fork(x => res.json( {error: true})) (x => res.json(x)) (proc(req))
	})

	// post :: kalendar
  app.get('/kalendar', (req, res)=> {
    // const proc = resolve(req)
    //   .pipe(map(prop('body')))
    //   .pipe(map(prop('id')))
    //   .pipe(chain(irrigations))
  
    fork (console.error) (x => res.send(x) ) (irrigations())
  })

	app.delete('/kalendar/:uuid', (req, res)=> {
		const {uuid} = req.params
		const {dates}  = deleteIrrigation(uuid)
		res.json(dates)
	})
} 