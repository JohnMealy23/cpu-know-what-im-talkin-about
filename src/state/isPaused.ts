import { PAUSE, PauseAction } from "./actions";

const initialState: boolean = false;

export const isPausedReducer = (
    state = initialState,
    { type }: PauseAction
) => {
    switch (type) {
        case PAUSE:
            return !state
        default:
            return state
    }
}
