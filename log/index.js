import { config } from 'shelljs'

const { appendFile } = require('./fs')
const { pipe, prop, chain, reduce } = require('ramda')
const { now, formatDate } = require('../lib/date')
const process = require('process')
const { resolve } = require('fluture')

const file = 'LOG-for-ALL'


// logger :: String -> Future String Error
const logger = msg => pipe(
  now,
  formatDate,
  x => `[${x}] {${process.pid}} ${msg}\n`,
  appendFile(file)
)(msg)




// setLoggerGetConfig :: {} -> Future {} Error
export const setLoggerGetConfig = response => pipe(
  prop('0'),
  ({_id, duration}) => ` [GET] Obtains this config { _id: ${_id}, duration: ${duration}}`,
  logger,
  chain(() => resolve(response))
)(response)

// setLoggerPutConfig :: {} -> Future {} Error
export const setLoggerPutConfig = response => pipe(
  prop('0'),
  ({_id, duration}) => ` [PUT] Obtains this config { _id: ${_id}, duration: ${duration}}`,
  logger,
  chain(() => resolve(response))
)(response)


// setLoggerPostKalendar :: {} -> Future {} Error
export const setLoggerPostKalendar = response => pipe(
  ({date, duration}) => ` [POST][/kalendar] { date: ${date}, duration: ${duration}}`,
  logger,
  chain(() => resolve(response))
)(response)

// setLoggerGetKalendar -> [] -> Future {} Error
export const setLoggerGetKalendar = response => pipe(
  x => reduce (
    (acc, {date, duration, _id}) => 
      `${acc} [GET][/kalendar] { _id: ${_id}, date: ${date}, duration: ${duration}}\n`,
  '', x),
  logger,
  chain(() => resolve(response))
)(response)

// setLoggerDeleteKalendar -> [] -> Future {} Error
export const setLoggerDeleteKalendar = response => pipe(
  date => ` [DELETE][/kalendar] { date: ${date} }`,
  logger,
  chain(() => resolve(response))
)(response)

// setLoggerPostIrrigate -> [] -> Future {} Error
export const setLoggerPostIrrigate = response => pipe(
  date => ` [POST][/irrigate] { date: ${date} }`,
  logger,
  chain(() => resolve(response))
)(response)