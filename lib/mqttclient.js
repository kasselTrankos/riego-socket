const mqtt = require('mqtt');
const Stream  =require('../fp/stream')
const Future = require('fluture')


export const client = mqtt.connect('mqtt://164.90.128.239:1883');
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
    
  mqttStreamClient
    .map(x => x.toString())
    .map(x => {
      io.emit('update-irrigate', x)
      return x
    }).subscribe({
      next: x => x
    })
}
module.exports = {
    mqttClient
}