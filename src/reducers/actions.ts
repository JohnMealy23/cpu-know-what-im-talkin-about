import { LoadSnapshot } from ".."

export type HeartbeatAction = {
    type: 'HEARTBEAT';
    data: LoadSnapshot;
}
export const HEARTBEAT = 'HEARTBEAT' as const
export const heartbeatAction = (data: LoadSnapshot): HeartbeatAction => ({
    type: HEARTBEAT,
    data
})

export type PauseAction = {
    type: 'PAUSE';
}
export const PAUSE = 'PAUSE' as const
export const pausedAction = (): PauseAction => ({ type: PAUSE })
