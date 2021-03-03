const { appendFile } = require('./fs')
const { pipe } = require('ramda')
const { now, formatDate } = require('../lib/date')
const process = require('process')

const file = 'LOG-for-ALL'


// add :: String -> Future String Error
export const logger = msg => pipe(
  now,
  formatDate,
  x => `[${x}] {${process.pid}} ${msg}\n`,
  appendFile(file)
)(msg)