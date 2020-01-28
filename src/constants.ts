export const LOW_LOAD_THRESHOLD_CPU = .25 as const
export const MEDIUM_LOAD_THRESHOLD_CPU = .5 as const
export const HIGH_LOAD_THRESHOLD_CPU = 1 as const
export const HIGH_LOAD_THRESHOLD_DURATION = 120000 as const // Two minutes
export const CPU_POLE_INTERVAL = 200 as const // Two seconds
export const SNAPSHOT_LIFESPAN = 600000
export const INTERVALS_TO_SCAN_FOR_HIGH_LOAD_DETECTION = HIGH_LOAD_THRESHOLD_DURATION / CPU_POLE_INTERVAL

export const ENDPOINTS = {
    getCpuAverage: 'getCpuAverage'
}
export const PORT = 8338
export const API_URL = `http://localhost:${PORT}`

// How long until something is dumped from state:
export const TIMEFRAME_IN_STATE = 500 as const // 24 hours

export const BAR_WIDTH = 14
export const CHART_HEIGHT = 255
