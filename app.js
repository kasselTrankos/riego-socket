// get from https://github.com/socketio/socket.io/issues/1015#issuecomment-16161612
require("tls").SLAB_BUFFER_SIZE = 100 * 1024; // 100Kb
const app = require('express')();
const bodyParser = require('body-parser');
const { fork, resolve, map, chain, alt } = require('fluture')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {findAll, riegoDone, setConfig, getConfig} = require('./src/riegos.js');

const { safeIsEmpty, eitherToFuture, prop } = require('./utils')
const { config } = require('./config')
const { S } = require('./helpers/sanctuary')


const { pipe } = S

// auto initialize client MQTT
const {mqttClient} = require('./lib/mqttclient')
mqttClient(io)

// const {madeKalendar, getKalendar, deleteIrrigation} = require('./kalendar'); 

////////////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

// get :: riegos
app.get('/riegos',  (req, res) => {
  fork (x => res.send({ error: 'riegos'})) (x => res.json(x)) (findAll())
})


// post :: riego
app.post('/riego', (req, res)=> {
  const proc = resolve(req)
    .pipe(map(prop('body')))
    .pipe(map(prop('id')))
    .pipe(chain(riegoDone))

  fork (console.error) (x => res.send(x) ) (proc(req.body.id))
})

app.get('/config', (_, res)=> {
  const proc = pipe([
    getConfig,
    S.chain(pipe([
      safeIsEmpty,
      eitherToFuture
    ])),
    S.alt(setConfig(config.id)(config.duration)),
    S.map(prop('0'))
  ])

  fork (x => res.send({error: 'empty'})) (x => res.send(x)) (proc(''))
})

app.put('/config/:duration', (req, res) => {
  // const {duration, _id} = req.params;
  const proc = pipe([
    prop('params'),
    prop('duration'),
    x => Number(x),
    setConfig(config.id),
    S.map(prop('0'))
  ])

  fork (x => res.json({error: true, x})) (x => res.json(x)) (proc(req))
  // const config = await setConfig(_id, duration);
  // res.json(config);
});


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