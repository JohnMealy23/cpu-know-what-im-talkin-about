import { LoadSnapshot } from ".."

// Snapshot actions:
export type HeartbeatAction = {
    type: 'HEARTBEAT';
    data: LoadSnapshot;
}
export const HEARTBEAT = 'HEARTBEAT' as const
export const heartbeatAction = (data: LoadSnapshot): HeartbeatAction => ({
    type: HEARTBEAT,
    data
})

export type DismissWarningAction = {
    type: 'DISMISS_WARNING';
}
export const DISMISS_WARNING = 'DISMISS_WARNING' as const
export const dismissWarningAction = (): DismissWarningAction => ({
    type: DISMISS_WARNING
})

export type SnapshotActions = HeartbeatAction | DismissWarningAction


// Pause actions:
export type PauseAction = {
    type: 'PAUSE';
}
export const PAUSE = 'PAUSE' as const
export const pausedAction = (): PauseAction => ({ type: PAUSE })
