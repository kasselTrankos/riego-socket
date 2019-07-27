const {madeKalendar} = require ('./../kalendar');
const fs = require('fs')    
const Irrigation = require ('./../src/irrigation');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');
const moment = require('moment-timezone');
const {expect} = require('chai');
const sinon = require('sinon');
const start = moment();
const end = moment().format('YYYY-MM-DD');
const file = { "configuration": { "priority": "dates" }, "sheduler": "* * * * * *", "dates": 
[{ date: start.add(2, 'hours').format('YYYY-MM-DD HH:mm'), 
  day: start.add(2, 'hours').format('YYYY-MM-DD'), "uuid": "123c0c70-a8ab-11e9-beb6-1f2bddafec9f", "duration": 10, "hour": 22, "minute": 13 }] };
const blessKalendar = jsc.bless({
  generator: () => {
    const format = value => value <= 9 ? `0${value}` : value;
    const start = moment().subtract(2, 'days').format('YYYY-MM-DD');
    const end = moment().add(2, 'days').format('YYYY-MM-DD');
    return {
      start, 
      end, 
      hour: jsc.integer(0, 24).generator.map(format)(),
      minute: jsc.integer(0, 60).generator.map(format)(),
      duration: jsc.integer(1, 60).generator(),
    };
  }
});


describe('Kalendar => ',  () => {
  it('madeKalendar', async () => {
    const A = blessKalendar.generator();
    const {message, status} = await madeKalendar(A);
    expect(status).to.be.true;
  });
  it('madeKalendar', async ()=> {
    const hour = Number(moment().format('HH'));
    const obj= {
      start: moment().format('YYYY-MM-DD'), 
      end: moment().add(2, 'days').format('YYYY-MM-DD'), 
      hour: moment().format('HH'), 
      minute: moment().add(2, 'minutes').format('mm'), 
      duration: 910};
    const _readFileSync = sinon.stub(fs, 'readFileSync');
    const _writeFileSync = sinon.stub(fs, 'writeFileSync')
    _readFileSync.returns(JSON.stringify(file));
    _writeFileSync.returns('djsdflhsdfhfd');
    const riegos = await madeKalendar(obj);
    expect(riegos.json.dates.length).to.be.equal(4);
    _readFileSync.returns(JSON.stringify([]));
    const obj1= {
      start: moment().format('YYYY-MM-DD'), 
      end: moment().add(3, 'days').format('YYYY-MM-DD'), 
      hour, 
      minute: 13, 
      duration: 910};
    const riegos1 = await madeKalendar(obj1);
    expect(riegos1.json.dates.length).to.be.equal(3);

    _readFileSync.restore();
    _writeFileSync.restore();
  });
});

