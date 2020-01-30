import { LoadSnapshot } from "..";
import { HeartbeatAction, HEARTBEAT } from "./actions";
import { SNAPSHOT_LIFESPAN } from "../constants";
import { logger } from "../logger";

const initialState: LoadSnapshot[] = [];

export const snapshotReducer = (
    state: LoadSnapshot[] = initialState,
    { type, data }: HeartbeatAction
) => {
    const now = Date.now()
    switch (type) {
        case HEARTBEAT:
            const prunedState = state.reduce((snapshots: LoadSnapshot[], snapshot) => {
                if (SNAPSHOT_LIFESPAN > now - snapshot.time.getTime()) {
                    snapshots.push(snapshot)
                } else {
                    logger('dropping:', snapshot)
                }
                return snapshots
            }, [])
            prunedState.push(data)
            return prunedState
        default:
            return state
    }
}
