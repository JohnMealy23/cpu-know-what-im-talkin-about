import { HIGH_LOAD_THRESHOLD_CPU, HIGH_LOAD_THRESHOLD_DURATION } from "../constants"
import { LoadSnapshot } from ".."
import { State } from "../reducers"

export const getSnapshots = (state: State): LoadSnapshot[] => state.snapshots

type LoadPeriod = {
    start: null | LoadSnapshot;
    end: null | LoadSnapshot;
}
type LoadPeriodsInternal = {
    highs: LoadPeriod[];
    lows: LoadPeriod[];
    lastHigh: LoadSnapshot | null;
}

export type LoadPeriods = Pick<LoadPeriodsInternal, 'highs' | 'lows'>

export const getHighAndLowPeriods = (state: State): LoadPeriods => {
    const snapshots = getSnapshots(state)

    const {
        highs,
        lows
    } = snapshots.reduce((
        loadPeriods: LoadPeriodsInternal,
        snapshot: LoadSnapshot
    ): LoadPeriodsInternal => {
        if (snapshot.load > HIGH_LOAD_THRESHOLD_CPU) {
            updateHighPeriod(loadPeriods.highs, snapshot)
            capPeriod(loadPeriods.lows)
            loadPeriods.lastHigh = snapshot
        } else {
            capPeriod(loadPeriods.highs)
            updateLowPeriod(loadPeriods, snapshot)
        }

        return loadPeriods
    }, {
        highs: [{ start: null, end: null }],
        lows: [{ start: null, end: null }],
        lastHigh: null
    })

    return {
        highs,
        lows,
    }
}

const updateLowPeriod = ({ highs, lastHigh, lows }: LoadPeriodsInternal, snapshot: LoadSnapshot) => {
    if (
        // Recovery periods only come after a high period, not including the initial null period:
        highs.length < 2 || 
        // There must a period of stability before recovery takes place:
        (lastHigh && !isGreaterThanTimeThreshold(lastHigh.time, snapshot.time))
    ) {
        return
    }
    const currentPeriod = lows[lows.length - 1]
    if (!currentPeriod.start) {
        // If this is the first snapshot of the extreme load, cache it:
        currentPeriod.start = snapshot
    } else if (isGreaterThanTimeThreshold(currentPeriod.start.time, snapshot.time)) {
        // If we've gone over the threshold for a high load period, cache the end time.
        currentPeriod.end = currentPeriod.end || snapshot
    }
}

const updateHighPeriod = (periods: LoadPeriod[], snapshot: LoadSnapshot): void => {
    const currentPeriod = periods[periods.length - 1]
    if (!currentPeriod.start) {
        // If this is the first snapshot of the extreme load, cache it:
        currentPeriod.start = snapshot
    } else if (isGreaterThanTimeThreshold(currentPeriod.start.time, snapshot.time)) {
        // If we've gone over the threshold for a high load period, cache the end time.
        // This will continue to overwrite the last high water mark:
        currentPeriod.end = snapshot
    }
}

const capPeriod = (periods: LoadPeriod[]): void => {
    // We've left the previous alert state.  We need to detect if this was a completed
    // period, or if we should drop it.
    const currentPeriod = periods[periods.length - 1]
    if (currentPeriod.end) {
        // If we've captured a complete period, start a new period:
        periods.push({ start: null, end: null })
    } else {
        // If we haven't captured a complete period, reset the clock:
        currentPeriod.start = null
    }
}

const isGreaterThanTimeThreshold = (timeEarlier: Date, timeLater: Date): boolean => {
    const timespan = timeLater.getTime() - timeEarlier.getTime()
    return timespan > HIGH_LOAD_THRESHOLD_DURATION
}

export const getLatestSnapshot = (state: State): LoadSnapshot | null => {
    const snapshots = getSnapshots(state)
    const snapshot = snapshots[snapshots.length - 1]
    if (snapshot) {
        return snapshot
    } else {
        return null
    }
}

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
