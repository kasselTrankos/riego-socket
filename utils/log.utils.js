const process = require('process')
const { pipe, curry, __, map, chain, prop } = require('ramda')
const { appendFile, stat, rename, writefile } = require('../log/fs')
const { now, formatDate, formatYYYMMDD_HHMM } = require('../lib/date')
const { reject, resolve, bichain, alt } = require('fluture')

const {logMaxSize, logName} = require('../config')

// logMsg :: Date -> String -> String
const logMsg = curry((date, msg) => `[${date}] {${process.pid}} ${msg}\n`)

const wrt = name => pipe(
  writefile(__, ''),
  chain(()=> fileSize(name))
)(name)

// fileSize :: String -> Future Number Error
const fileSize = name => pipe(
  x => stat(x),
  map(prop('size')),
)(name)

// rejectRenamed :: String -> Future Reject
const rejectRenamed = name => pipe(
  now,
  formatYYYMMDD_HHMM,
  x => `${name}_${x}`,
  reject
)(name)

// 
const renameFileIfExceeds = curry((size, name)=>
  size > logMaxSize ? rejectRenamed(name) : resolve(name)
)

const renameFile = curry((oldname, newname)=> pipe(
  rename(oldname, __),
  chain(()=> writefile(oldname, ''))
)(newname)) 

  


const saveToFile = curry((name, content) => pipe(
  () => alt (wrt(name)) (fileSize(name)),
  chain(renameFileIfExceeds(__, name)),
  bichain (renameFile(name, __)) (resolve),
  chain(()=>appendFile(name, content) )
)(name))


// logger :: String -> Future String Error
export const logger = msg => pipe(
  now,
  formatDate,
  logMsg(__, msg),
  saveToFile(logName)
)(msg)