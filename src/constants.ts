export const LOW_LOAD_THRESHOLD_CPU = .25 as const
export const MEDIUM_LOAD_THRESHOLD_CPU = .5 as const
export const HIGH_LOAD_THRESHOLD_CPU = .2 as const
export const HIGH_LOAD_THRESHOLD_DURATION = 5000 as const // Two minutes
export const CPU_POLE_INTERVAL = 2000 as const // Ten seconds
export const SNAPSHOT_LIFESPAN = 600000 as const // Ten minutes

export const ENDPOINTS = {
    getCpuAverage: 'cpu'
}
export const PORT = 8338
export const API_URL = `http://localhost:${PORT}`

// How long until something is dumped from state:
export const TIMEFRAME_IN_STATE = 500 as const // 24 hours

export const BAR_WIDTH = 14
export const CHART_HEIGHT = 255
