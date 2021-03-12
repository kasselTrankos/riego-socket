const request = require('supertest')
const { app } = require('../app')
const { kalendar: { file}} = require('../config')

import "core-js/stable";
import "regenerator-runtime/runtime";
import fs from 'fs';
import moment from 'moment-timezone';
const d = moment().set({hour:0,minute:0,second:0,millisecond:0});
import '../initialize'

describe('Kalendar => ',  () => {

  it('add date ', async () => {
    const date = moment().add(1, 'hours').valueOf()
    const t = 10
    const add = await request(app)
      .post(`/kalendar`)
      .send({duration: t, date})
      .set('Accept', 'application/json')
    
    const kalendar = await fs.readFileSync(file, 'utf8')
    const del = await request(app)
      .delete(`/kalendar`)
      .send({date})
    const { dates } = JSON.parse(kalendar)
    expect(new Date(dates[0])).toEqual(new Date(date))
  })
})

