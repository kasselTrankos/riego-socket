// readline
import fs from 'fs'
import path from 'path';
import { Future, resolve, ap } from 'fluture'
const { curry } = require('ramda')

// basename :: String -> String
export const basename = file => path.basename(file);

// createWriteStream :: String -> String -> Async e String
export const appendFile = curry((name, msg) => Future((rej, res) =>{ 
    fs.appendFile(name, msg, err => err ? rej(err) : res(msg))
    return () => { console.log ('CANT CANCEL')}
}));


// access :: String -> Future a b
export const access =  file => Future((rej, res) => {
    fs.access(file, (err)=> err ? rej(file) : res(file))
    return () => { console.log ('CANT CANCEL')}
})


// rename :: String -> Future a b
export const rename = curry((oldname, newname) => Future((rej, res) => {
    fs.rename(oldname, newname, ()=> 
        res(newname)
    )
    return () => { console.log ('CANT CANCEL')}
}))

// stat :: String -> Future a b
export const stat = file => Future((rej, res) => {
    fs.stat(file, (err, stats)=> err 
        ? rej(err)
        : res(stats)
    )
    return () => { console.log ('CANT CANCEL')}
});

// read :: String -> Future Array Error
export const readdir = dir => Future((rej, res) => { 
    fs.readdir(dir, (err, files) => err
        ? rej(err)
        : res(files));
    return () => { console.log ('CANT CANCEL')}
});

// isdirectory :: String -> Future e Bool
export const isdirectory = path => Future((rej, res)=> {
    fs.stat(path, (err, stats) =>  err ? rej(err) : res(stats.isDirectory()))
    return ()=> { console.log('CANT be CANCELED')}
});

// concatPaths :: String -> [String] -> [ String ]
export const concatPaths = a => b => b.map(c => `${a}/${c}`)

// readDir :: String -> Future e [ String ]
export const readDir = file => resolve(concatPaths)
  .pipe(ap(resolve(file)))
  .pipe(ap(readdir(file)))