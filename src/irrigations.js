// kalendars

const MongoClient = require('mongodb').MongoClient;
const { Future } = require('fluture')
const {url, dbName, riegosDB} = require('./../config.js');
const { curry } = require('ramda')



// updateOne :: {} -> {} -> {} -> Future Error {}
export const updateOne = curry((query, update, options) => Future((rej, res) => {
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    const collection = db.collection(riegosDB)
    collection.updateOne(query, update ,options)
      .then(x => res(x))
      .catch(x => rej(x))
  })
  return () => { console.log ('CANT CANCEL')}
}))

// find :: {} -> Future Error [ {} ]  
export const find = query => Future((rej, res) => {
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    const collection = db.collection(riegosDB)
    collection.find(query).sort( { date: 1 } ).toArray((err, docs) =>{
      err ? rej(err) : res(docs)
        client.close();
    }) 
  })
  return () => { console.log ('CANT CANCEL')}
});


// deleteOne :: () -> Future Error {}
export const deleteOne = date => Future((rej, res) => {
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    const collection = db.collection(riegosDB)
    collection.deleteOne({date}, (err, result) => {
      result && result.result && result.result.ok === 1 ?  res(result) : rej(err)
    })
  })
  return () => { console.log ('CANT CANCEL')}
});
