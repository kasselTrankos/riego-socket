// get from https://github.com/socketio/socket.io/issues/1015#issuecomment-16161612
require("tls").SLAB_BUFFER_SIZE = 100 * 1024; // 100Kb
const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {findAll, getConfig,
  riegoDone, putConfig} = require('./src/riegos.js');
const {madeKalendar, getKalendar, deleteIrrigation} = require('./kalendar'); 

const {socket} = require('./src/socket');
socket(io);
////////////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
  
app.get('/riegos', async (req, res) => {
  const riegos = await findAll();
  res.json(riegos);
});
app.get('/config', async (req, res) => {
  const config = await getConfig();
  res.json(config);
});

app.put('/config/:_id/:duration', async (req, res) => {
  const {duration, _id} = req.params; 
  const config = await putConfig(_id, duration);
  res.json(config);
});
app.post('/kalendar', async (req, res)=> {
  const response  = await madeKalendar(req.body);
  res.send(response);
});
app.get('/kalendar', async (req, res)=> {
  const {dates}  = await getKalendar();
  res.json(dates);
});
app.delete('/kalendar/:uuid', (req, res)=> {
  const {uuid} = req.params; 
  const {dates}  = deleteIrrigation(uuid);
  res.json(dates);
});
  
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/riego', async (req, res)=> {
  const response  = await riegoDone(req.body.id);
  res.send(response);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});