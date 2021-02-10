// get from https://github.com/socketio/socket.io/issues/1015#issuecomment-16161612
require("tls").SLAB_BUFFER_SIZE = 100 * 1024; // 100Kb
const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { initializeConfig } = require('./app/config')
const { initializeKalendar } = require('./app/kalendar')



// auto initialize client MQTT
const {mqttClient} = require('./lib/mqttclient')
mqttClient(io)

const {madeKalendar, getKalendar, deleteIrrigation} = require('./kalendar'); 

////////////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies


// init config routes
initializeConfig(app)
initializeKalendar(app)






app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

module.exports = { app }