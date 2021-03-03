const { fork, resolve } = require('fluture')
const R = require('ramda')
const { setConfig, getConfig} = require('../src/configs')
const ObjectID = require('mongodb').ObjectID
const { prop, toNumber } = require('../utils')
const { config } = require('../config')
const { safeIsEmpty, eitherToFuture, S } = require('../helpers/sanctuary')
const { setLoggerGetConfig, setLoggerPutConfig } = require('../log')
const { sendEmail, mailOptions } = require('./email')

const { pipe } = S
// config

// setDefaultConfig -> {} -> []
const setDefaultConfig = R.pipe(
  R.converge(
    (id, duration) => [id, duration],
    [
      R.pipe(prop('id'), ObjectID),
      R.pipe(prop('duration'), toNumber)
    ]
  ),
)


export const initializeConfig = app => {
  
  // get :: config
  app.get('/config', (_, res)=> {
    const proc = pipe([
      getConfig,
      S.chain(pipe([
        safeIsEmpty,
        eitherToFuture
      ])),
      S.alt(pipe([
        setDefaultConfig,
        R.apply(setConfig)
      ])(config)),
      S.chain(setLoggerGetConfig),
      S.map(prop('0')),
      // S.bichain(()=> sendEmail(mailOptions)) (resolve),
    ])
  
    fork (x => res.send({error: 'empty'})) (x => res.send(x)) (proc(''))
  })
  
  // put :: config/:duration
  app.put('/config', (req, res) => {
    const proc = pipe([
      prop('body'),
      prop('duration'),
      duration => Object.assign({}, config, {duration}),
      setDefaultConfig,
      R.apply(setConfig),
      S.chain(setLoggerPutConfig),
      S.map(prop('0'))
    ])
  
    fork (x => res.json({error: true, x})) (x => res.json(x)) (proc(req))
  });
}


