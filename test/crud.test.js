// crud.trest
const request = require('supertest')
const { app } = require('../app')
const { configDB } = require('../config')
const { dropCollection } = require('../src/riegos')
const { fork, resolve } = require('fluture')
const { S } = require('../helpers/sanctuary')

const { alt } = S



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

  it('riegos', async () => {
    const res = await request(app)
      .get('/riegos')
  
    expect(res.body).toEqual([]) 
    expect(res.statusCode).toEqual(200)
  })
})



describe('PUTs', () => {
  it('/config/:duration', ()=> {
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
})

