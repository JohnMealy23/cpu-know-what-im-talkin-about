import { LoadSnapshot } from ".."
import { State } from "../state"
import { Warning, LoadPeriod } from "../state/snapshots"
import { HIGH_LOAD_FLAG } from "../constants"
import { roundToHundredth } from "../utils"

export const getSnapshots = (state: State): LoadSnapshot[] => state.snapshots.loads

export const getWarning = (state: State): Warning => state.snapshots.warning

export const getLatestSnapshot = (state: State): LoadSnapshot | null => {
    const snapshots = getSnapshots(state)
    const snapshot = snapshots[snapshots.length - 1]
    if (snapshot) {
        return snapshot
    } else {
        return null
    }
}

export const getCpuAverage = ({ snapshots: { loads } }: State): number => !loads.length ? 0 : roundToHundredth(loads
    .reduce((total: number, { load }) => total + load, 0) / loads.length)

export type MaxAndMin = {
    max: LoadSnapshot | null;
    min: LoadSnapshot | null;
}
export const getCpuRange = (state: State): MaxAndMin => {
    const snapshots = getSnapshots(state)
    return snapshots.reduce((highAndLow: MaxAndMin, snapshot) => {
        if (!highAndLow.max || snapshot.load > highAndLow.max.load) {
            highAndLow.max = snapshot
        } else if (!highAndLow.min || snapshot.load < highAndLow.min.load) {
            highAndLow.min = snapshot
        }
        return highAndLow
    }, {
        max: null,
        min: null
    })
}

export const getIsPaused = (state: State): boolean => state.isPaused

export type HighsAndRecoveries = {
    highs: LoadPeriod[];
    recoveries: LoadPeriod[];
}
export const getHighsAndRecoveries = (state: State): HighsAndRecoveries => state
    .snapshots.periods.reduce((highsAndRecoveries: HighsAndRecoveries, period) => {
        if (period.type === HIGH_LOAD_FLAG) {
            highsAndRecoveries.highs.push(period)
        } else {
            highsAndRecoveries.recoveries.push(period)
        }
        return highsAndRecoveries
    }, {
        highs: [],
        recoveries: []
    })
