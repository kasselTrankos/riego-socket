// get from https://github.com/socketio/socket.io/issues/1015#issuecomment-16161612
require("tls").SLAB_BUFFER_SIZE = 100 * 1024; // 100Kb
const app = require('express')();
const bodyParser = require('body-parser');
const { fork, resolve, map, chain } = require('fluture')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {findAll, riegoDone, putConfig} = require('./src/riegos.js');
const { prop } = require('./utils')

// auto initialize client MQTT
const {mqttClient} = require('./lib/mqttclient')
mqttClient(io)

// const {madeKalendar, getKalendar, deleteIrrigation} = require('./kalendar'); 

////////////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

// get :: riegos
app.get('/riegos',  (req, res) => {
  fork (console.error) (x => res.json(x)) (findAll())
});
// post :: riego
app.post('/riego', (req, res)=> {
  const proc = resolve(req)
    .pipe(map(prop('body')))
    .pipe(map(prop('id')))
    .pipe(chain(riegoDone))

  fork (console.error) (x => res.send(x) ) (proc(req.body.id))
});

// app.put('/config/:_id/:duration', async (req, res) => {
//   const {duration, _id} = req.params; 
//   const config = await putConfig(_id, duration);
//   res.json(config);
// });
// app.delete('/kalendar/:uuid', (req, res)=> {
//   const {uuid} = req.params; 
//   const {dates}  = deleteIrrigation(uuid);
//   res.json(dates);
// });

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

module.exports = { app }