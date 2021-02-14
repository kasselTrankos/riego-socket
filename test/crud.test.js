// crud.trest
const request = require('supertest')
const { app } = require('../app')
const { configDB } = require('../config')
const { dropCollection } = require('../src/configs')
const { fork, resolve } = require('fluture')
const { S } = require('../helpers/sanctuary')

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
  it('/kalendar/:date/:duration/:irrigated', async () => {
    const d = '2020-12-23'
    const t = 189
    const date = new Date(d).getTime()
    const add = await request(app)
      .post(`/kalendar/${date}/${t}`)
    
    const put = await request(app)
      .put(`/kalendar/${date}/${t}/true`)
    
    const res = await request(app)
      .get(`/kalendar/${date}`)

    expect(res.body[0].date).toEqual(`${d}T00:00:00.000Z`)
    expect(res.body[0].duration).toEqual(t)
    expect(res.body[0].irrigated).toEqual(true)
    expect(res.statusCode).toEqual(200)

    const del = await request(app)
      .delete(`/kalendar/${date}`)
  })
})

describe('POSTs', ()=> {
  it('/kalendar/:date/:duration', async () => {
    const d = '2020-12-23'
    const t = 189
    const date = new Date(d).getTime()
    const add = await request(app)
      .post(`/kalendar/${date}/${t}`)
    
    const res = await request(app)
      .get(`/kalendar/${date}`)

    expect(res.body[0].date).toEqual(`${d}T00:00:00.000Z`)
    expect(res.body[0].duration).toEqual(t)
    expect(res.statusCode).toEqual(200)

    const del = await request(app)
      .delete(`/kalendar/${date}`)
  })
})

describe('GETs', ()=> {
  it('/config', done => {

    const test = (c) => {
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

    fork (x => console.log(x)) (test) (dropCollection(configDB))
  })

  it('kalendar', async () => {
    const d = '2023-10-10'
    const date = new Date(d).getTime()
    const add = await request(app)
      .post(`/kalendar/${date}/109`)
    
    const res = await request(app)
      .get('/kalendar')
  
    expect(res.body[0].date).toEqual(`${d}T00:00:00.000Z`)
    expect(res.body[0].duration).toEqual(109)
    expect(res.statusCode).toEqual(200)
    
    const del = await request(app)
      .delete(`/kalendar/${date}`)
  })
})

describe('DELETE', ()=> {
  it('/kalendar/:date', async () => {
    const d = '2023-10-10'
    const date = new Date(d).getTime()
    const add = await request(app)
      .post(`/kalendar/${date}/89`)
    
    const res = await request(app)
      .delete(`/kalendar/${date}`)
  
    expect(res.body).toEqual({deleted: true})
    expect(res.statusCode).toEqual(200)
  })
})




