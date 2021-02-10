// sanctuary

const sanctuary  = require('sanctuary')
const { env } = require('fluture-sanctuary-types')

export const S = sanctuary.create ({
  checkTypes: true, 
  env: sanctuary.env.concat(env)
})
