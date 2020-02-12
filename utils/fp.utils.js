import {Maybe}  from './../fp';
const {Nothing, Just} = Maybe;
const curry = f => a => b => f(a, b);
const compose = (...fncs) => x => fncs.reduceRight((acc, f) => f(acc), x); 
const prop =  key => obj => obj[key];
const safeProp = key => obj => obj[key] ? Just(obj[key]) : Nothing;

module.exports =  {compose, curry, safeProp, prop};