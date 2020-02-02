// System settings
export const HIGH_LOAD_THRESHOLD_CPU = .2 as const
export const HIGH_LOAD_THRESHOLD_DURATION = 10000 as const // Ten seconds
export const RECOVERY_THRESHOLD_DURATION = 10000 as const // Ten seconds
export const CPU_POLE_INTERVAL = 2000 as const // Two seconds
export const SNAPSHOT_LIFESPAN = 100000 as const // Ten minutes

// export const HIGH_LOAD_THRESHOLD_CPU = 1 as const
// export const HIGH_LOAD_THRESHOLD_DURATION = 120000 as const // Two minutes
// export const RECOVERY_THRESHOLD_DURATION = 120000 as const // Two minutes
// export const CPU_POLE_INTERVAL = 10000 as const // Ten seconds
// export const SNAPSHOT_LIFESPAN = 600000 as const // Ten minutes

// Colors
export const COLOR_WARNING = 'rgb(255, 148, 148)' as const
export const COLOR_RECOVERY = 'rgb(160, 160, 255)' as const
export const COLOR_NOMINAL = 'rgb(214, 214, 214)' as const

// API Settings
export const ENDPOINTS = {
    getCpuAverage: 'cpu-stats'
}
export const PORT = 8338
export const API_URL = `http://localhost:${PORT}`

// Logging flag
export const LOGGING = true

// Flag values
export type LoadPeriodType = 'HIGH_LOAD_FLAG' | 'RECOVERY_FLAG'
export const HIGH_LOAD_FLAG: LoadPeriodType = 'HIGH_LOAD_FLAG'
export const RECOVERY_FLAG: LoadPeriodType = 'RECOVERY_FLAG'

