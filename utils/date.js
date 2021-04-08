const { pipe, not } = require('ramda')
const moment = require('moment')

// toMoment :: String -> Moment
const toMoment = x => moment(x)

// gteNow :: String -> Boolean
export const gteNow = pipe(toMoment, x => x.isAfter())

// lteNow :: String -> Boolean
export const lteNow = pipe(gteNow, not)

// toDate :: a -> Date
export const toDate = x => new Date(x)