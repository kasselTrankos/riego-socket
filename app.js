const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {findAll, madeRiego, getConfig,
  riegoDone, putConfig} = require('./riegos.js');
  const {madeKalendar} = require('./kalendar'); 
  
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
    const text = response.error ? 'KO logs...' : 'OK done!'  
    res.send(text);
  });
  
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
app.post('/riego', async (req, res)=> {
  const response  = await riegoDone(req.body.id);
  const text = response.error ? 'KO logs...' : 'OK done!'  
  res.send(text);
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('made riego', async (msg) => {
    const {ops} = await madeRiego(msg);
    io.emit('made riego', ops[0]);
    
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});