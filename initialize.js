// index
const {app, startApp} = require('./app')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const {kron} = require('./lib/kron')


// auto initialize client MQTT
const {mqttClient} = require('./lib/mqttclient')

mqttClient(io)
startApp(io)
kron(io)

module.exports = { http }

