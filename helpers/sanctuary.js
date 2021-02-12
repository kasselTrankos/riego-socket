// sanctuary

const sanctuary  = require('sanctuary')
const Future = require('fluture')
const { env } = require('fluture-sanctuary-types')
const { curry, isEmpty } = require('ramda')

export const S = sanctuary.create ({
  checkTypes: true, 
  env: sanctuary.env.concat(env)
})


// safeIsEmpty :: * -> Either  
export const safeIsEmpty = x =>  isEmpty(x) ? S.Left(x) : S.Right(x)

export const safeProp = curry((msg, k, o) => o[k] ? S.Right(o[k]) : S.Left(msg))

// eitherToFuture :: Either -> Future error a
export const eitherToFuture = S.either (Future.reject) (Future.resolve)