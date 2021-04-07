// fs.js
const fs = require('fs')
const { Future } = require('fluture')
const { curry } = require('ramda')

// writefile :: String -> String -> Async e String
export const writefile = curry((name, data) => Future((rej, res) =>{ 
  fs.writeFile(name, data, err => err ? rej(err) : res(data))
  return () => { console.log ('CANT CANCEL')}
}))