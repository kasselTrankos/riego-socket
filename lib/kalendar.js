const { Future } = require('fluture')
const R = require('ramda')
const fs = require('fs')




//  setDates -> Array -> {}
export const setDates = dates => console.log(dates, 'iupdate json ') || ({configuration:{priority:'dates'}, sheduler: "* * * * * *", dates})

// jsonToString :: {} -> string
export const jsonToString = obj => JSON.stringify(obj)


// writeJson -> String -> String -> Future Error 
export const writeFile = R.curry((file, data) => Future((rej, res) => {
    fs.writeFile(file, data, err =>  err ? rej(err) : res(data))
    return () => { console.log ('CANT CANCEL')}
}))