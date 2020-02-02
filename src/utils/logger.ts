import { DEBUG } from "../constants"

export const logger = (...rest: any[]) => DEBUG && console.log(...rest)
