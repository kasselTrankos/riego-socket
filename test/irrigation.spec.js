const Irrigation = require ('./../src/irrigation');
const laws = require('fantasy-laws');
const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');



const blessSome = (length=3) => jsc.bless({
  generator: ()=> {
    const elms = Array.from({length}, ()=> 
      ({duration: jsc.integer(0, 60).generator(), y: jsc.integer(0, 60).generator()}));
    return Irrigation.Some(elms);
  }
});
const blessCons = (length=3) => jsc.bless({
  generator: ()=> {
    const elms = Array.from({length}, ()=> ({a: jsc.integer(0, 60).generator(), b: jsc.integer(0, 60).generator()}));
    return Irrigation.from(elms);
  }
});
const {identity, composition} = laws.Functor(Z.equals, Irrigation);
const testSomeIdentity = identity(blessSome());
const testConsIdentity = identity(blessCons(9));

const testConsComposition = composition(blessCons(4), jsc.bless({generator:() =>  x => {x.a =  x.a * 3; return x}}), jsc.bless({generator: ()=> x => {x.b = x.b +10; return x}}));
const testSomeComposition = composition(blessSome(4), jsc.bless({generator:() =>  x => {x.duration =  x.duration * 3; return x}}), jsc.bless({generator: ()=> x => {x.y = x.y +10; return x}}));

const A = Irrigation.from([ {a:180, b: 12}, {a: 4, b:0}, {a:11, b:2}, {a:134, b:109}, {a:190, b: 112},{a: 212, b:1}, {a: 1, b:12}, {a: 1901, b:2}]);
const B = A.sort();

// console.log(A.toArray(), '000000', B.toArray());
// let bubbleSort = (inputArr) => {
//   let len = inputArr.length;
//   for (let i = 0; i < len; i++) {
//       for (let j = 0; j < len; j++) {
//         console.log('i:', i, ', j:', j);
//           if (inputArr[j] > inputArr[j + 1]) {
//               let tmp = inputArr[j];
//               inputArr[j] = inputArr[j + 1];
//               inputArr[j + 1] = tmp;
//           }
//       }
//   }
//   return inputArr;
// };

// bubbleSort([90, 1893, 94,0,19,234])

describe('Irrigation => ',  () => {
  it('testSomeIdentity', testSomeIdentity);
  it('testConsIdentity', testConsIdentity);
  it('testConsComposition', testConsComposition);
  it('testSomeComposition', testSomeComposition);
});

