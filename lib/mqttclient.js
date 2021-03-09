const mqtt = require('mqtt');
const Stream  =require('../fp/stream')
const Future = require('fluture')
const { log } = require('../utils')
const { pipe } = require('ramda')


export const client = mqtt.connect('mqtt://127.0.0.1:1883');

const irrigate = io => duration => Future((rej, res) =>{ 
  try {
    client.publish('topic/irrigate-now', duration)
    res(duration)
    io.emit('update-irrigate',`made an irrigation { duration: ${duration}, date: ${new Date()}}` )
  } catch (err) {
    rej(err)
  }
  return () => { console.log ('CANT CANCEL')}
});

const updateNextIrrigate = x => Future((rej, res) =>{ 
  try {
    client.publish('topic/irrigate-update-next', 'mqtt-reload-get-next-irrigation')
    res(x)
  } catch (err) {
    rej(err)
  }
  return () => { console.log ('CANT CANCEL')}
});


const mqttStreamClient = Stream (subscriber => {
  client.on('connect',  () => {
    client.subscribe('topic/irrigation');
  });
  
  client.on('message',  (topic, message) => {
      subscriber.next(message)
      
  });
})
const mqttClient = io => {
  mqttStreamClient
    .map(x => x.toString())
    .map(x => {
      io.emit('update-irrigate', x)
      return x
    }).subscribe({
      next: log('topic/irrigation')
    })
}
module.exports = {
    mqttClient,
    irrigate,
    updateNextIrrigate
}