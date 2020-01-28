const logging = true
export const logger = (...rest) => {
    if (logging === true)
    console.log(...rest)
}
