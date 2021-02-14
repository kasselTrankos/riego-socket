const mqtt = require('mqtt');
const Stream  =require('../fp/stream')
var client = mqtt.connect('mqtt://192.168.1.25:1883');

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