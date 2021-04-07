const R = require('ramda')
const { S } = require('../helpers/sanctuary')
const { find } = require('../src/irrigations')
const {kalendar: { file}} = require('../config')
const { writefile} = require('../lib/fs')



//  setDates -> Array -> {}
const setDates = dates => ({ configuration:{ priority:'dates' }, sheduler: "* * * * * *", dates })

// jsonToString :: {} -> string
const jsonToString = obj => JSON.stringify(obj)


// updateKalendar :: String -> Future * Error
export const updateKalendarDates = S.pipe([
  ()=> find({ 
    date: { 
      $gte: new Date() 
    } 
  }),
  S.map(S.pipe([ 
    S.map(R.prop('date')),
    setDates,
    jsonToString 
  ])),
  R.chain( writefile(file) )
])