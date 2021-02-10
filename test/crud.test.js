// crud.trest
const request = require('supertest')
const { app } = require('../app')
describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .get('/riegos')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual([])
  })
})
