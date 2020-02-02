import { HIGH_LOAD_THRESHOLD_CPU, HIGH_LOAD_THRESHOLD_DURATION, RECOVERY_THRESHOLD_DURATION } from "./constants"

export const LANGUAGE_CHART_LABEL = 'Processor Load'
export const LANGUAGE_AVERAGE_CPU_LABEL = 'Average CPU Load'
export const LANGUAGE_CPU_CHANGE_OVER_TIME_LABEL = 'CPU Range Over Time'
export const LANGUAGE_HEAVY_LOAD_HISTORY_LABEL = 'Periods of Heavy Load'
export const LANGUAGE_RECOVERY_HISTORY_LABEL = 'Periods of Recovery'
export const LANGUAGE_ALERT_LABEL = 'Alert!'
export const LANGUAGE_WARNING_ALERT = `CPU under high load: Above ${HIGH_LOAD_THRESHOLD_CPU} for over ${HIGH_LOAD_THRESHOLD_DURATION / 1000} seconds!`
export const LANGUAGE_RECOVERY_ALERT = `CPU is back under control: Under ${HIGH_LOAD_THRESHOLD_CPU} for over ${RECOVERY_THRESHOLD_DURATION / 1000} seconds!`
