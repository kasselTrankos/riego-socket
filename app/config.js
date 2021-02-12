const { fork, resolve, map, chain, alt } = require('fluture')
const {findAll, riegoDone, setConfig, getConfig} = require('../src/configs')
const { prop } = require('../utils')
const { config } = require('../config')
const { safeIsEmpty, eitherToFuture, S } = require('../helpers/sanctuary')


const { pipe } = S
// config


export const initializeConfig = app => {
    // get :: riegos    
  app.get('/riegos',  (req, res) => {
    fork (x => res.send({ error: 'riegos'})) (x => res.json(x)) (findAll())
  })
  
  // get :: config
  app.get('/config', (_, res)=> {
    const proc = pipe([
      getConfig,
      S.chain(pipe([
        safeIsEmpty,
        eitherToFuture
      ])),
      S.alt(setConfig(config.id)(config.duration)),
      S.map(prop('0'))
    ])
  
    fork (x => res.send({error: 'empty'})) (x => res.send(x)) (proc(''))
  })
  
  // put :: config/:duration
  app.put('/config/:duration', (req, res) => {
    const proc = pipe([
      prop('params'),
      prop('duration'),
      x => Number(x),
      setConfig(config.id),
      S.map(prop('0'))
    ])
  
    fork (x => res.json({error: true, x})) (x => res.json(x)) (proc(req))
  });
}


