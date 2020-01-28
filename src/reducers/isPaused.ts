import { Action, PAUSE } from "./actions";

const initialState: boolean = false;

export const isPausedReducer = (
    state = initialState,
    { type }: Action<undefined>
) => {
    switch (type) {
        case PAUSE:
            return !state
        default:
            return state
    }
}
