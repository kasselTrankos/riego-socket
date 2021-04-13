// get from https://github.com/socketio/socket.io/issues/1015#issuecomment-16161612
require("tls").SLAB_BUFFER_SIZE = 100 * 1024; // 100Kb
const app = require('express')();
const bodyParser = require('body-parser')
const session = require('express-session')
const R = require('ramda')

const { initializeConfig } = require('./app/config')
const { initializeKalendar } = require('./app/kalendar')

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