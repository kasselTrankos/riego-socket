// get from https://github.com/socketio/socket.io/issues/1015#issuecomment-16161612
require("tls").SLAB_BUFFER_SIZE = 100 * 1024; // 100Kb
const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const { exec } = require('child_process');

////////////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
  
  
app.get('/', function(req, res){
	exec('pm2 restart 0', (err, stdout, stderr) => {
		if (err) {
			console.error(`exec error: ${err}`);
			// return;
		}
	
		res.sendFile(__dirname + '/public/reload.html');
		console.log(`Number of files ${stdout}`);
	});
});


http.listen(3001, function(){
  console.log('listening on *:3001');
});