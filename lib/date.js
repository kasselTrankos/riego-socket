const { pipe } = require('ramda')

// toDate :: a -> Date
export const toDate = x => new Date(x)

// getTime :: Date -> Number
export const getTime = d => d.getTime()

// getMonth :: Date -> Number
export const getMonth = d => d.getMonth()

// getDate :: Date -> Number
export const getDate = d => d.getDate()

// getFullYear :: Date -> Number
export const getFullYear = d => d.getFullYear()

// getHours :: Date -> Number
export const getHours = d => d.getHours()

// getMinutes :: Date -> Number
export const getMinutes = d => d.getMinutes()

// getSeconds :: Date -> Number
export const getSeconds = d => d.getSeconds()


// addZero :: Number -> String
const addZero = x => x < 10 ? `0${x}` : `${x}`


// now :: () -> Date
export const now = () => new Date()

const month = pipe(
    getMonth,
    addZero
)
const day = pipe(
    getDate,
    addZero
)

const hour = pipe(
    getHours,
    addZero
)

const minute = pipe(
    getMinutes,
    addZero
)

const second = pipe(
    getSeconds,
    addZero
)


// formatDate :: Date -> String
export const formatDate  = x => `${day(x)}/${month(x)}/${getFullYear(x)} ${hour(x)}:${minute(x)}:${second(x)}`

export const formatYYYMMDD_HHMM  = x => `${getFullYear(x)}${month(x)}${day(x)}_${hour(x)}${minute(x)}${second(x)}`
