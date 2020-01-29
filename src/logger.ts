const logging = true
export const logger = (...rest: any[]) => {
    if (logging === true)
    console.log(...rest)
}
