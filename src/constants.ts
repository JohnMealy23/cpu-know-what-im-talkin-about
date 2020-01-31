export const LOW_LOAD_THRESHOLD_CPU = .25 as const
export const MEDIUM_LOAD_THRESHOLD_CPU = .5 as const
export const HIGH_LOAD_THRESHOLD_CPU = .2 as const
export const HIGH_LOAD_THRESHOLD_DURATION = 6000 as const // Two minutes
export const LENGTH_OF_RECOVERY_PERIOD = 10000 as const // Ten seconds
export const CPU_POLE_INTERVAL = 1000 as const // Ten seconds
export const SNAPSHOT_LIFESPAN = 1000000 as const // Ten minutes

export const COLOR_WARNING = 'rgb(255, 148, 148)' as const
export const COLOR_RECOVERY = 'rgb(160, 160, 255)' as const
export const COLOR_NOMINAL = 'rgb(214, 214, 214)' as const

export const ENDPOINTS = {
    getCpuAverage: 'cpu-stats'
}
export const PORT = 8338
export const API_URL = `http://localhost:${PORT}`

// How long until something is dumped from state:
export const TIMEFRAME_IN_STATE = 500 as const // 24 hours

export const LOGGING = true
