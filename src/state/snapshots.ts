import { LoadSnapshot } from "..";
import { HEARTBEAT, SnapshotActions, DISMISS_WARNING } from "./actions";
import {
    HIGH_LOAD_THRESHOLD_CPU,
    HIGH_LOAD_THRESHOLD_DURATION,
    RECOVERY_THRESHOLD_DURATION,
    SNAPSHOT_LIFESPAN,
    HIGH_LOAD_FLAG,
    RECOVERY_FLAG,
    LoadPeriodType
} from "../constants";

export type SnapshotState = {
    loads: LoadSnapshot[];
    periods: LoadPeriod[];
    warning: Warning;
}

type LoadPeriodInternal = {
    start: null | LoadSnapshot;
    end: null | LoadSnapshot;
    type: null | LoadPeriodType;
}

export type LoadPeriod = {
    start: LoadSnapshot;
    end: LoadSnapshot;
    type: LoadPeriodType;
}

export type Warning = {
    active: boolean;
    type: LoadPeriodType | null;
}

const initialState = {
    loads: [],
    periods: [],
    warning: {
        active: false,
        type: null,
    }
}

export const snapshotReducer = (
    state: SnapshotState = initialState,
    action: SnapshotActions
) => {
    let newState
    switch (action.type) {
        case HEARTBEAT:
            const snapshot = action.data
            const now = Date.now()
            newState = { ...state }
            newState.loads = newState.loads.filter((snapshot: LoadSnapshot) => SNAPSHOT_LIFESPAN > now - snapshot.time.getTime())
            newState.loads.push(snapshot)
            newState.periods = getHighAndLowPeriods(newState.loads)
            newState.warning = getWarning(newState, snapshot)
            return newState
        case DISMISS_WARNING:
            newState = {...state}
            newState.warning = {...state.warning, active: false }
            return newState
        default:
            return state
    }
}

export const getHighAndLowPeriods = (state: LoadSnapshot[]): LoadPeriod[] => state.reduce((
    periods: LoadPeriodInternal[],
    snapshot: LoadSnapshot
): LoadPeriodInternal[] => {
    if (snapshot.load > HIGH_LOAD_THRESHOLD_CPU) {
        updatePeriod({
            snapshot,
            periods,
            oppositePeriodFlag: RECOVERY_FLAG,
            thisPeriodFlag: HIGH_LOAD_FLAG,
            thresholdTime: HIGH_LOAD_THRESHOLD_DURATION
        })
    } else {
        updatePeriod({
            snapshot,
            periods,
            oppositePeriodFlag: HIGH_LOAD_FLAG,
            thisPeriodFlag: RECOVERY_FLAG,
            thresholdTime: RECOVERY_THRESHOLD_DURATION
        })
        // If we start out in a low period, it doesn't count as a recovery, so purge it:
        if (periods.length === 1) {
            periods[0].start = null
        }
    }

    return periods
}, [createPeriod()]).reduce(trimIncompleteReducer, [])

const createPeriod = (): LoadPeriodInternal => ({ start: null, end: null, type: null })

type UpdatePeriodConfig = {
    periods: LoadPeriodInternal[], 
    snapshot: LoadSnapshot,
    oppositePeriodFlag: LoadPeriodType,
    thisPeriodFlag: LoadPeriodType,
    thresholdTime: number
}
const updatePeriod = ({
    periods,
    snapshot,
    oppositePeriodFlag,
    thisPeriodFlag,
    thresholdTime,
}: UpdatePeriodConfig): void => {
    let currentPeriod = periods[periods.length - 1]
    if (currentPeriod.type === oppositePeriodFlag) {
        currentPeriod = endPeriod(periods)
    }
    if (!currentPeriod.start) {
        // If this is the first snapshot of the extreme load, cache it:
        currentPeriod.start = snapshot
        currentPeriod.type = thisPeriodFlag
    } else if (hasPassedThreshold(currentPeriod.start.time, snapshot.time, thresholdTime)) {
        // If we've gone over the threshold for a high load period, cache the end time.
        // This will continue to overwrite the last high water mark:
        currentPeriod.end = snapshot
    }
}

const endPeriod = (periods: LoadPeriodInternal[]): LoadPeriodInternal => {
    // We've left the previous alert state.  We need to detect if this was a completed
    // period, or if we should drop it.
    let currentPeriod = periods[periods.length - 1]
    if (currentPeriod.end) {
        // If we've captured a complete period, start a new period:
        currentPeriod = createPeriod()
        periods.push(currentPeriod)
    } else {
        // If we haven't captured a complete period, reset the clock:
        currentPeriod.start = null
    }
    return currentPeriod
}

// This would be a better .filter, but TS doesn't recognize filters as TypeGuards:
const trimIncompleteReducer = (
    periodsFiltered: LoadPeriod[], 
    { start, end, type }: LoadPeriod
) => {
    if (
        start !== null && 
        end !== null && 
        type !== null
    ) {
        periodsFiltered.push({ start, end, type })
    }
    return periodsFiltered
}

const hasPassedThreshold = (
    timeEarlier: Date,
    timeLater: Date,
    threshold: number = HIGH_LOAD_THRESHOLD_DURATION
): boolean => {
    const timespan = timeLater.getTime() - timeEarlier.getTime()
    return timespan > threshold
}

const getWarning = (
    state: SnapshotState,
    snapshot: LoadSnapshot
): Warning => {
    const { warning: oldWarning, periods } = state
    const currentPeriod = periods[periods.length - 1]
    let newWarning
    if (
        // Test if current snapshot is in the current high or low period
        isInPeriod(currentPeriod, snapshot) && 
        // Only create new warning sta
        oldWarning.type !== currentPeriod.type
    ) {
        newWarning = {
            type: currentPeriod.type,
            active: true,
        }
    } else {
        newWarning = oldWarning
    }
    return newWarning
}

// Check to see that the last period has a start but no end, or that its end
// matches the last snapshot taken:
const isInPeriod = (currentPeriod: LoadPeriod, snapshot: LoadSnapshot): boolean =>
    (!!currentPeriod && currentPeriod.end === snapshot)
