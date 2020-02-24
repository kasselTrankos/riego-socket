const { madeRiego } = require('./riegos');
const moment = require('moment');
const MADE_RIEGO = 'made riego';
const ON_MADE_RIEGO = 'on made riego';
const IRRIGATE = 'irrigate';
const ON_IRRIGATE = 'on-irrigate';

export const socket = io => {
  io.on('connection', function(socket){
    socket.on(MADE_RIEGO || IRRIGATE, async (msg, time) => {
      const {ops} = await madeRiego(msg, time);
      const {duration} = ops[0];
      console.log(`${moment().format('DD-MM-YYYY HH:mm:ss')} (${process.pid}) saved riego with duration of ${duration}`);
      io.emit(ON_IRRIGATE, ops[0]);
    });
    socket.on('error', function(e){
      console.log(`${moment().format('DD-MM-YYYY HH:mm:ss')} (${process.pid}) socket with this error of ${e}`);
    })
  });
}