// get from https://github.com/socketio/socket.io/issues/1015#issuecomment-16161612
require("tls").SLAB_BUFFER_SIZE = 100 * 1024; // 100Kb
const app = require('express')();
const bodyParser = require('body-parser')
const session = require('express-session')
const R = require('ramda')
const { fork } = require('fluture')

const { initializeConfig } = require('./app/config')
const { initializeKalendar } = require('./app/kalendar');
const { readfile } = require("./lib/fs");
const { EOL } = require("os");

var auth = (req, res, next) =>
  (req.session.auth) 
    ? next()
    :res.redirect('/')



////////////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
app.use(session({
  secret: 'njdsflsdfjldf-asdfkudslñl-2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}))

const startApp = (io) => {
  // init config routes
  initializeConfig(app)
  initializeKalendar(io, app)
  app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
  })
  app.get('/home', auth, async (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  })
  app.get('/logs', auth, (req, res)=> {
    const proc = R.pipe(
      readfile,
      R.map(x => x.split(EOL)),
      R.map(R.map(x => `<li  class="list-group-item">${x}</li>`)),
      R.map(x => x.join(EOL)),
      R.map(x => `<!doctype html>
      <html>
        <head>
          <script src="/socket.io/socket.io.js"></script>
          <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
          <!-- Latest compiled and minified CSS -->
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <script>
          $(function () {
            var socket = io();
            
            socket.on('update-irrigate', function(msg){
              $('#list').append($('<li class="list-group-item" />').text(msg));
            });
            
          });
        </script>
          <title>Irrigation v2.0</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font: 13px Helvetica, Arial; }
            .center {text-align: center;}
            .top20{margin-top: 20px;}
            .fixed {position: fixed; bottom: 0; width: 100%;}
          </style>
        </head>
        <body>
          <h1 class="center">Irrigation v.2.0</h1>
          <div class="container">
            <ul class="list-group list-group-flush">
              ${x}
            </ul>
          </div>
        </body>
      </html>`)
    )

    fork(console.log)(x => res.send(x)) (proc('./irrigation_log'))
  })
  app.post('/login', async (req, res) => {
    const auth = R.converge((user, pwd) => user === 'yo' && pwd === 'yo', [
      R.pipe(
        R.prop('body'),
        R.prop('user')
      ),
      R.pipe(
        R.prop('body'),
        R.prop('pwd')
      )
    ])
    req.session.auth = auth(req)
    res.redirect('/home');
  })


}










module.exports = { app, startApp }