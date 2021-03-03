const { fork } = require('fluture')
const Future = require('fluture')
const R = require('ramda')
const { prop } = require('../utils')
const { config } = require('../config')
const { S } = require('../helpers/sanctuary')
var nodemailer = require('nodemailer')

const { pipe } = S
// config

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: config.email,
      pass: config.pwd
  }
})

export const mailOptions = {
  from: 'Remitente',
  to: 'alvaro.touzon@gmail.com',
  subject: 'ERROR in [PROCESS IRRIGATION]',
  text: 'BODY'
}
export const sendEmail = mailOptions => Future((rej, res) =>{ 

  transporter.sendMail(mailOptions, err => {
    err
      ? rej(err)
      : rej('mail enviado')
  })
  return () => { console.log ('CANT CANCEL')}
});

export const initializeConfig = app => {
  
  
  // put :: config/:duration
  app.post('/email', (req, res) => {
    const proc = pipe([
      prop('body'),
      prop('text'),
      text => Object.assign({}, mailOptions, {text}),
      sendEmail
    ])
  
    fork (x => res.json({error: true, x})) (x => res.json(x)) (proc(req))
  });
}


