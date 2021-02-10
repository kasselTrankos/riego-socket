// kalendars

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const { Future } = require('fluture')
const {url, dbName, riegosDB} = require('./../config.js');


// insertIrrigation :: Date -> Int -> Future Error {}
export const insertIrrigation = date => duration => Future((rej, res) => {
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    const collection = db.collection(riegosDB)
    collection.insertOne({date: new Date(date), duration})
      .then(x => res(x))
      .catch(rej)
  })
  return () => { console.log ('CANT CANCEL')}
})

// findAll :: () -> Future Error [ {} ]  
export const irrigations = () => Future((rej, res) => {
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    const collection = db.collection(riegosDB)
    collection.find({date: {
      $gte: new Date()
    }}).toArray((err, docs) =>{
      err ? rej(err) : res(docs)
        client.close();
    }) 
  })
  return () => { console.log ('CANT CANCEL')}
});

// irrigations :: 
export const irrigationDone = id => Future((rej, res) => {
  let _client;
  MongoClient.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err)  return rej(err)
    _client = client
    const db = client.db(dbName)
    const collection = db.collection(riegosDB)
    collection.updateOne({_id: ObjectID(id)}, {$set: {done: new Date(), isDone: true}}, {upsert: true}).toArray((err, docs) =>{
      err ? rej(err) : res(docs)
        client.close()
    }) 
  })
  return () => { _client.close()}
});