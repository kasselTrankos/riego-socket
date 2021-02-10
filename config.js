const env = process.env.NODE_ENV || 'development';


module.exports = {
  config: {
      duration: 10,
      id: '00000001dda85d44fa0638d6'
  },
  url: 'mongodb://localhost:27017',
  dbName: 'irrigations',
  riegosDB: env === 'test' ? 'testIrrigate' : 'irrigate',
  configDB: env === 'test' ? 'testConfig': 'config'
}
