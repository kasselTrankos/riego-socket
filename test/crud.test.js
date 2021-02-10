// crud.trest
const request = require('supertest')
const { app } = require('../app')
const { configDB } = require('../config')

describe('POSTs', () => {
})

describe('GETs', ()=> {
  it('/config', async ()=> {
    // drop if exits
    
    const res = await request(app)
      .get('/config')
    
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      _id: "00000001dda85d44fa0638d6",
      duration: 10,
    })
  })

  it('riegos', async () => {
    const res = await request(app)
      .get('/riegos')
  
    expect(res.body).toEqual([]) 
    expect(res.statusCode).toEqual(200)
  })
})


