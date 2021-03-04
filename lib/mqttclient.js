const mqtt = require('mqtt');
const Stream  =require('../fp/stream')
const Future = require('fluture')
const { log } = require('../utils')


export const client = mqtt.connect('mqtt://10.108.0.2:1883');
// console.log(client, 'asdhasldk')



export const irrigate = duration => addFuture((rej, res) =>{ 
  client.publish('irrigate-now', duration)
  console.log('publicado')
  res(duration)
  return () => { console.log ('CANT CANCEL')}
});


const mqttStreamClient = Stream (subscriber => {
  client.on('connect',  () => {
    client.subscribe('outTopic');
  });
  
  client.on('message',  (topic, message) => {
      subscriber.next(message)
  });
})
const mqttClient = io => {
  console.log('START: MQTT')
  mqttStreamClient
    .map(x => x.toString())
    .map(x => {
      io.emit('update-irrigate', x)
      return x
    }).subscribe({
      next: x => pipe(
        log('OUT PO O P')
      )(x)
    })
}
module.exports = {
    mqttClient
}