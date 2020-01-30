import { HIGH_LOAD_THRESHOLD_CPU, HIGH_LOAD_THRESHOLD_DURATION } from "../constants"
import { LoadSnapshot } from ".."
import { State } from "../reducers"

export const getSnapshots = (state: State): LoadSnapshot[] => state.snapshots

type LoadPeriodPartial = {
    start: null | LoadSnapshot;
    end: null | LoadSnapshot;
}
type LoadPeriodsPartial = {
    highs: LoadPeriodPartial[];
    lows: LoadPeriodPartial[];
}

export type LoadPeriod = {
    start: LoadSnapshot;
    end: LoadSnapshot;
}
export type LoadPeriods = {
    highs: LoadPeriod[];
    lows: LoadPeriod[];
}

const isGreaterThanTimeThreshold = (timeEarlier: Date, timeLater: Date): boolean => {
    const timespan = timeLater.getTime() - timeEarlier.getTime()
    return timespan > HIGH_LOAD_THRESHOLD_DURATION
}

export const getHighAndLowPeriods = (state: State): LoadPeriods => {
    const snapshots = getSnapshots(state)

    const {
        highs,
        lows
    } = snapshots.reduce((
        loadPeriods: LoadPeriodsPartial,
        snapshot: LoadSnapshot
    ): LoadPeriodsPartial => {
        if (snapshot.load > HIGH_LOAD_THRESHOLD_CPU) {
            updatePeriod(loadPeriods.highs, snapshot)
            capPeriod(loadPeriods.lows)
        } else {
            updatePeriod(loadPeriods.lows, snapshot)
            capPeriod(loadPeriods.highs)
        }
        return loadPeriods
    }, {
        highs: [{ start: null, end: null }],
        lows: [{ start: null, end: null }],
    })

    return {
        highs: trimIncomplete(highs),
        lows: trimIncomplete(lows)
    }
}

const capPeriod = (periods: LoadPeriodPartial[]): void => {
    const currentPeriod = periods[periods.length - 1]
    if (currentPeriod.start && currentPeriod.end) {
        // If we've captured a complete period, start a new period:
        periods.push({ start: null, end: null })
    } else {
        // If we haven't captured a complete period, reset the clock:
        currentPeriod.start = null
    }
}

const updatePeriod = (periods: LoadPeriodPartial[], snapshot: LoadSnapshot): void => {
    const currentPeriod = periods[periods.length - 1]
    // If we're entering a period of high load...
    if (!currentPeriod.start) {
        // If this is the first snapshot of the high load, cache it:
        currentPeriod.start = snapshot

    } else if (isGreaterThanTimeThreshold(currentPeriod.start.time, snapshot.time)) {
        // If we've gone over the threshold for a high load period, cache the end time.
        // This will continue to overwrite until 
        currentPeriod.end = snapshot
    }
}

const trimIncomplete = (periods: LoadPeriodPartial[]): LoadPeriod[] => {
    return periods.reduce((ps: LoadPeriod[], { start, end }) => {
        if (start && end) {
            ps.push({ start, end })
        }
        return ps
    }, [])
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
