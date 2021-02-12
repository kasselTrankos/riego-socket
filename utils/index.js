import {compose, prop} from './fp.utils'

// log :: String -> a -> a
const log = label => x =>
    (console.log(`[${label}]:`, x), x)

module.exports =  {compose, prop, log};