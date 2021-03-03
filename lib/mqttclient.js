const mqtt = require('mqtt');
const Stream  =require('../fp/stream')
const Future = require('fluture')


export const client = mqtt.connect('mqtt://192.168.1.25:1883');
export const irrigate = duration =>  Future((rej, res) =>{ 
  client.publish('irrigate-now', duration)
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