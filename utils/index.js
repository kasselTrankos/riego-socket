// log :: String -> a -> a
export const log = label => x =>
    (console.log(`[${label}]:`, x), x)

// toNumber :: a -> Number
export const toNumber = x => Number(x)

// prop :: String -> {} -> a
export const prop = k => o => o[k]