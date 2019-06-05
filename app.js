const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {findAll, madeRiego, getConfig,
  riegoDone} = require('./riegos.js');

app.get('/riegos', async (req, res) => {
  const riegos = await findAll();
  res.json(riegos);
});
app.get('/config', async (req, res) => {
  const config = await getConfig();
  res.json(config);
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