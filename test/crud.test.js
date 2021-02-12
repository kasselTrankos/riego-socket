// crud.trest
const request = require('supertest')
const { app } = require('../app')
const { configDB, riegosDB } = require('../config')
const { dropCollection } = require('../src/configs')
const { fork, resolve } = require('fluture')
const { S } = require('../helpers/sanctuary')

const { alt } = S

describe('PUTs', () => {
  it('/config/:duration', done=> {
    request(app)
      .put('/config/89')
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
          _id: "00000001dda85d44fa0638d6",
          duration: 89,
        })
        return done()
      })
  })
  it('/kalendar/:date/:duration', done => {
    const test = () => {
      request(app)
        .post('/kalendar/1602288000000/89')
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200)
          expect(res.body.date).toEqual('2020-10-10T00:00:00.000Z')
          expect(res.body.duration).toEqual(89)
          return done()
        })
      }
      const dropIfExists = name => alt(resolve(0)) (dropCollection(name))
      fork (x => console.log(x)) (test) (dropIfExists(riegosDB))  
  })
})

describe('GETs', ()=> {
  it('/config', done => {

    const test = () => {
      request(app)
        .get('/config')
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200)
          expect(res.body).toEqual({
            _id: "00000001dda85d44fa0638d6",
            duration: 10,
          })
          return done()
        })
    }
    const dropIfExists = name => alt(resolve(0)) (dropCollection(name))

    fork (x => console.log(x)) (test) (dropIfExists(configDB))
  })

  it('kalendar', async () => {
    const add = await request(app)
      .post('/kalendar/1917820800000/109')
    
    const res = await request(app)
      .get('/kalendar')
  
    expect(res.body[0].date).toEqual('2030-10-10T00:00:00.000Z')
    expect(res.body[0].duration).toEqual(109)
    expect(res.statusCode).toEqual(200)
  })
})




