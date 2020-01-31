import { HIGH_LOAD_THRESHOLD_CPU, COLOR_WARNING, COLOR_RECOVERY } from "./constants"

export const formatTime = (time: Date) => `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`

export const getColor = (load: number): string => {
    if (load > HIGH_LOAD_THRESHOLD_CPU) {
        return COLOR_WARNING
    } else {
        return COLOR_RECOVERY
    }
}

export const getGradientColor = (load: number): string => `rgb(${Math.round(255 * load)}, 0, 0)`
