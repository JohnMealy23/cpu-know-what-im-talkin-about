import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { snapshotReducer, SnapshotState } from './snapshots'
import { isPausedReducer } from './isPaused'
import { combineReducers } from 'redux'

export type State = {
    snapshots: SnapshotState;
    isPaused: boolean;
}

export const reducers = combineReducers({
    snapshots: snapshotReducer,
    isPaused: isPausedReducer,
})

export const store = createStore(reducers, applyMiddleware(thunk));
