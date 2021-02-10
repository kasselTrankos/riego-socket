const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const { Future } = require('fluture')
const {url, dbName, riegos, configDB} = require('./../config.js');


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
export const setConfig = id => duration => Future((rej, res) =>{
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    const collection = db.collection(configDB)
    collection
    .updateOne({_id: ObjectID(id)}, {$set: {duration: Number(duration)}}, {upsert: true})
    .then(r =>{
      res([{ _id: id, duration}])
    })
    .catch(e => rej(e))
  })
  return () => { console.log ('CANT CANCEL')}
})

// findAll :: () -> Future Error [ {} ]  
export const findAll = () => Future((rej, res) => {
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    const collection = db.collection(riegos)
    collection.find({}).toArray((err, docs) =>{
      err ? rej(err) : res(docs)
        client.close();
    }) 
  })
  return () => { console.log ('CANT CANCEL')}
});
export const riegoDone = id => Future((rej, res) => {
  let _client;
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    _client = client
    const db = client.db(dbName)
    const collection = db.collection(riegos)
    collection.updateOne({_id: ObjectID(id)}, {$set: {done: new Date(), isDone: true}}, {upsert: true}).toArray((err, docs) =>{
      err ? rej(err) : res(docs)
        client.close()
    }) 
  })
  return () => { _client.close()}
});