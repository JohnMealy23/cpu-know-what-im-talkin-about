import { INTERVALS_TO_SCAN_FOR_HIGH_LOAD_DETECTION, HIGH_LOAD_THRESHOLD_CPU } from "../constants"
import { LoadSnapshot } from ".."
import { logger } from "../logger"

export const heavyLoadSnapshots = (loadHistory: LoadSnapshot[]): LoadSnapshot[] => {
    const heavyLoads = []
    // Using a for loop, rather than reduce, as we don't want to loop through the entire
    // history - just the last n items.
    for (let i = 0; i < INTERVALS_TO_SCAN_FOR_HIGH_LOAD_DETECTION; i++) {
        const snapshot = loadHistory[i]
        if (snapshot && snapshot.load >= HIGH_LOAD_THRESHOLD_CPU) {
            logger('So heavy!:', snapshot, HIGH_LOAD_THRESHOLD_CPU)
            heavyLoads.push(snapshot)
        }
    }
    return heavyLoads
}
