const Riegos = require ('./../src/riegos');
const {concat} = require('ramda');
const FL = require('fantasy-land');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');
const R = Riegos.from([1, 2, 3, 9 ,90]).map(x => x * 2).toArray();
console.log(Riegos.from([13,3,3, 90, 23, 3,3,45,6,2,3]).filter(x=> x % 3 === 0 ).toArray());
