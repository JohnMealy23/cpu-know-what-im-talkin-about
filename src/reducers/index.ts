import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { snapshotReducer } from './snapshots'
import { isPausedReducer } from './isPaused'
import { combineReducers } from 'redux'
import { LoadSnapshot } from '..'

export type State = {
    snapshots: LoadSnapshot[];
    isPaused: boolean;
}

export const reducers = combineReducers({
    snapshots: snapshotReducer,
    isPaused: isPausedReducer,
})

export const store = createStore(reducers, applyMiddleware(thunk));
