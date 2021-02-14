import {compose} from './fp.utils'

// log :: String -> a -> a
export const log = label => x =>
    (console.log(`[${label}]:`, x), x)
export const toNumber = x => Number(x)
export const prop = k => o => o[k]