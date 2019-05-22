const MongoClient = require('mongodb').MongoClient;
const {url, dbName, collection} = require('./config.js');
const madeRiego = async (riego) => {
  let client;
  try {
    client = await MongoClient.connect(url);
    return await client.db(dbName).collection(collection).insertOne({riego: riego, date: new Date()}); 
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

    const result = await client.db(dbName).collection(collection).find({}).toArray();
    console.log(result);
    return result;
  } catch (err) {
    return  {};
    //soon control it
    // throw err;
  } finally {
    client.close(); 
  }
};
module.exports = {
  findAll, madeRiego
}