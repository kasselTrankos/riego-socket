const MongoClient = require('mongodb').MongoClient;
const { Future } = require('fluture')
const {url, dbName, configDB} = require('./../config.js');
const { curry } = require('ramda')

// getconfig :: () -> Future Error {}
export const getConfig = () => Future((rej, res) => {
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    const collection = db.collection(configDB)
    collection.find({}).toArray((err, docs) =>{
      err ? rej(err) : res(docs)
        client.close();
    }) 
  })
  return () => { console.log ('CANT CANCEL')}
})

// setConfig -> String -> Int -> Future Error [{}]
export const setConfig = curry((id, duration) => Future((rej, res) =>{
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    const collection = db.collection(configDB)
    collection
    .updateOne({_id: id}, {$set: { duration } }, {upsert: true})
    .then(r =>{
      res([{ _id: id, duration}])
    })
    .catch(e => rej(e))
  })
  return () => { console.log ('CANT CANCEL')}
}))

// dropCollection -> String -> Future Error [{}]
export const dropCollection = collectionName => Future((rej, res) =>{
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    const collection = db.collection(collectionName)
    .drop((err, result) => {
      if(err) rej(err)
      res(result)
      client.close()
    })
  })
  return () => { console.log ('CANT CANCEL')}
})
