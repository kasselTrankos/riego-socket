const R = require('ramda')
const fs = require('fs')
const { S } = require('../helpers/sanctuary')
const { Future } = require('fluture')
const { find } = require('../src/irrigations')
const {kalendar: { file}} = require('../config')



//  setDates -> Array -> {}
export const setDates = dates => ({configuration:{priority:'dates'}, sheduler: "* * * * * *", dates})

// jsonToString :: {} -> string
export const jsonToString = obj => JSON.stringify(obj)


// writeJson -> String -> String -> Future * Error 
export const writeFile = R.curry((file, data) => Future((rej, res) => {
    fs.writeFile(file, data, err =>  err ? rej(err) : res(data))
    return () => { console.log ('CANT CANCEL')}
}))

// updateKalendar :: String -> Future * Error
export const updateKalendar = S.pipe([
  S.chain(()=> find({date: {$gte: new Date()}})),
  S.map(S.pipe([ 
    S.map(prop('date')),
    setDates,
    jsonToString 
  ])),
  R.chain( writeFile(file) )
])