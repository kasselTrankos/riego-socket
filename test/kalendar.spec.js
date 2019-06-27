const {madeKalendar} = require ('./../kalendar');
const Irrigation = require ('./../src/irrigation');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');
const {expect} = require('chai');

const blessCons = (length=3) => jsc.bless({
  generator: ()=> {
    const now =  new Date();
    const from = new Date(now.setDate(now.getDate()-jsc.integer(0, 100).generator()))
    const to = new Date(now.setDate(now.getDate()+jsc.integer(0, 100).generator()))
    const elms = Array.from({length}, ()=> (
      {
        date: jsc.datetime(from, to).generator(), 
        b: jsc.integer(0, 60).generator(),
      }));
    return Irrigation.from(elms);
  }
});


describe('Kalendar => ',  () => {
  it('madeKalendar', () => {
    const A = blessCons(146).generator().toArray();
    madeKalendar();
  })

});

