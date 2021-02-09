const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const { Future } = require('fluture')
const {url, dbName, riegos, config} = require('./../config.js');

const getClient = async (url) =>  await MongoClient.connect(url);

export const getConfig = async () => {
  const client = await getClient(url);
  try {
    const [result] =  await client.db(dbName).collection(config).find({_id: ObjectID('5cf970b0c52511b14d75b351')}).toArray(); 
    return result;
  } catch(error) {
    return {duration: 30, error}; 
    // throw error;
  } finally {
    client.close();
  } 
}
export const putConfig = async (id, duration) => {
  const client = await getClient(url);
  try {
    return  await client.db(dbName).collection(config).updateOne({_id: ObjectID(id)}, {$set: {duration: Number(duration)}}, {upsert: true}); 
  } catch(error) {
    return {duration: 30}; 
    // throw error;
  } finally {
    client.close();
  } 
}
export const madeRiego = async (riego, time) => {
  const client = await getClient(url);
  try {
    const {duration} = await getConfig();
    return await client.db(dbName).collection(riegos).insertOne({riego: riego, date: new Date(), duration: time ? time : duration, inmediate: true, programated: false}); 
  } catch(error) {
    throw error;
  } finally {
    client.close();
  } 
};
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