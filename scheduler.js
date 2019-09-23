process.env.TZ = 'Europe/Madrid';
const {sheduler} = require('./lib/kron');
sheduler();