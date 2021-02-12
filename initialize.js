// index
const {app} = require('./app')
const http = require('http').Server(app)
const io = require('socket.io')(http)


// auto initialize client MQTT
const {mqttClient} = require('./lib/mqttclient')
mqttClient(io)

