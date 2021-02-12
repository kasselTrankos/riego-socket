const mqtt = require('mqtt');
const { Observable, from } = require('rxjs')
const { map } =require('rxjs/operators')
var client = mqtt.connect('mqtt://192.168.1.25:1883');

const mqttStreamClient = new Observable (subscriber => {
    client.on('connect',  () => {
      client.subscribe('outTopic');
    });
    
    client.on('message',  (topic, message) => {
        subscriber.next(message)
    });
})
const mqttClient = io => {
    
    from(mqttStreamClient).pipe(
        map(x => x.toString()),
        map(x => {
            io.emit('update-irrigate', x)
            return x
        })
    )
    .subscribe(
        x => x
    )
}


module.exports = {
    mqttClient
}