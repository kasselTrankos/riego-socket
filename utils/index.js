const Future = require('fluture')
import {compose, prop} from './fp.utils'
const sanctuary  = require('sanctuary')
const { env } = require('fluture-sanctuary-types')
const { isEmpty } = require('ramda')

const S = sanctuary.create ({
  checkTypes: true, 
  env: sanctuary.env.concat(env)
})

// safeIsEmpty :: * -> Either  
const safeIsEmpty = x =>  isEmpty(x) ? S.Left(x) : S.Right(x)

// eitherToFuture :: Either -> Future error a
const eitherToFuture = S.either (Future.reject) (Future.resolve)

module.exports =  {compose, prop, eitherToFuture, safeIsEmpty};