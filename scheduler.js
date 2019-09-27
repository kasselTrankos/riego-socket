process.env.TZ = 'Europe/Madrid';
const {scheduler} = require('./lib/kron');
scheduler();