import { LOGGING } from "../constants"

export const logger = (...rest: any[]) => LOGGING && console.log(...rest)
