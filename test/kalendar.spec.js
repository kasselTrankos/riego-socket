import "core-js/stable";
import "regenerator-runtime/runtime";
import {madeKalendar, getKalendar} from './../kalendar';
import jsc from 'jsverify';
import {stub} from 'sinon';
import fs from 'fs';
import moment from 'moment-timezone';
import {expect} from 'chai';
const d = moment().set({hour:0,minute:0,second:0,millisecond:0});
const file = { configuration: { priority: 'dates' }, sheduler: '* * * * * *',
dates: [{
  date: d.add(2, 'hours').format('YYYY-MM-DD HH:mm'), 
  day: d.add(2, 'hours').format('YYYY-MM-DD'), 
  uuid: '123c0c70-a8ab-11e9-beb6-1f2bddafec9f',
  duration: 10, 
  hour: 22, 
  minute: 13}] 
};
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
    const {_, status} = await madeKalendar(A);
    expect(status).to.be.true;
  });
  it('madeKalendar:after is sorted', async () => {
    const A = blessKalendar.generator();
    const {_, status} = await madeKalendar(A);
    const dates = getKalendar();
    for(let i = 0; i < dates.length; i++) {
      expect(+new Date(dates[i].date) < +new Date(dates[i+1].date)).to.be.true;
    }
    expect(status).to.be.true;
  });
  it('madeKalendar:no dates before now', async () => {
    const A = blessKalendar.generator();
    const {_, status} = await madeKalendar(A);
    const dates = getKalendar();
    for(let i = 0; i < dates.length; i++) {
      expect(+new Date(dates[i].date) > +new Date()).to.be.true;
    }
    expect(status).to.be.true;
  });
  it('madeKalendar:no dates before now even add one before now', async () => {
    const format = value => value <= 9 ? `0${value}` : value;
    const minutes = new Date().getMinutes() - 10;
    const A = {
      start: moment().subtract(20, 'days').format('YYYY-MM-DD'), 
      end: moment().format('YYYY-MM-DD'), 
      hour: format(new Date().getHours()),
      minute: format(minutes),
      duration: jsc.integer(1, 60).generator(),
    };

    const {_, status} = await madeKalendar(A);
    const dates = getKalendar();
    for(let i = 0; i < dates.length; i++) {
      expect(+new Date(dates[i].date) > +new Date()).to.be.true;
    }
    expect(status).to.be.true;
  });

  it('update kalendar', async ()=> {
    const hour = Number(d.format('HH'));
    const days = 6;
    const obj = {
      start: d.format('YYYY-MM-DD'), 
      end: d.add(days, 'days').format('YYYY-MM-DD'), 
      hour: d.format('HH'), 
      minute: d.add(2, 'minutes').format('mm'), 
      duration: 910};
    const _readFileSync = stub(fs, 'readFileSync');
    const _writeFileSync = stub(fs, 'writeFileSync')
    _readFileSync.returns(JSON.stringify(file));
    _writeFileSync.returns('bad response');
    const riegos = await madeKalendar(obj);
    expect(riegos.json.dates.length).to.be.equal(days);

    ///given empty
    const dd = moment().set({hour:0,minute:0,second:0,millisecond:0});
    const n = moment().set({hour:0,minute:0,second:0,millisecond:0});
    _readFileSync.returns(JSON.stringify([]));
    const obj1= {
      start: dd.format('YYYY-MM-DD'), 
      end: dd.add(3, 'days').format('YYYY-MM-DD'), 
      hour, 
      minute: 13, 
      duration: 910};
    const riegos1 = await madeKalendar(obj1);
    expect(riegos1.json.dates.length).to.be.equal(dd.diff(n, 'days'));

    _readFileSync.restore();
    _writeFileSync.restore();
  });
});

