const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const {url, dbName, riegos, config} = require('./config.js');

const getConfig = async () => {
  let client;
  try {
    client = await MongoClient.connect(url);
    const [result] =  await client.db(dbName).collection(config).find({_id: ObjectID('5cf970b0c52511b14d75b351')}).toArray(); 
    return result;
  } catch(error) {
    return {duration: 30, error}; 
    // throw error;
  } finally {
    client.close();
  } 
}
const putConfig = async (id, duration) => {
  let client;
  
  try {
    client = await MongoClient.connect(url);
    console.log(id, 'dur', duration, 'pppp');
    return  await client.db(dbName).collection(config).updateOne({_id: ObjectID(id)}, {$set: {duration: duration}}, {upsert: true}); 
  } catch(error) {
    console.log(error);
    return {duration: 30}; 
    // throw error;
  } finally {
    client.close();
  } 
}
const madeRiego = async (riego) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    const {duration} = await getConfig();
    return await client.db(dbName).collection(riegos).insertOne({riego: riego, date: new Date(), duration, inmediate: true, programated: false}); 
  } catch(error) {
    throw error;
  } finally {
    client.close();
  } 
};
const findAll = async () => {
  let client;
  try {
    client = await MongoClient.connect(url);
    return  await client.db(dbName).collection(riegos).find({}).toArray();
  } catch (err) {
    return  {};
    //soon control it
    // throw err;
  } finally {
    client.close(); 
  }
};
const riegoDone = async (id) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    return  await client.db(dbName).collection(riegos).updateOne({_id: ObjectID(id)}, {$set: {done: new Date(), isDone: true}}, {upsert: true});
  } catch (err) {
    return  {id, error: true};
  } finally {
    client.close(); 
  }
};
module.exports = {
  findAll, madeRiego, getConfig,
  riegoDone, putConfig
}