import { PAUSE, Actions } from "./actions";

const initialState: boolean = false;

export const isPausedReducer = (
    state = initialState,
    { type }: Actions
) => {
    switch (type) {
        case PAUSE:
            return !state
        default:
            return state
    }
}
