import {Maybe}  from './../fp';
const {Nothing, Just} = Maybe;
const curry = f => a => b => f(a, b);
const compose = (...fncs) => x => fncs.reduceRight((acc, f) => f(acc), x); 
const prop =  key => obj => obj[key];
const safeProp = key => obj => obj[key] ? Just(obj[key]) : Nothing;
const chain = curry((x, xs)=> xs.chain(x));
const pipe = (...fns) => x => fns.reduce((acc, f)=> f(acc), x);
const map = curry((x, xs)=> xs.map(x));
const flatmap = curry((x, xs)=> xs.flatmap(x));
const filter = curry((x, xs)=> xs.filter(x));

module.exports =  {compose, curry, safeProp, prop, 
  chain, pipe, map, flatmap, filter};
