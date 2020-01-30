import axios from 'axios'
import * as React from 'react';
import { Provider } from 'react-redux'
import * as ReactDOM from 'react-dom'

import { App } from './components/App'
import { store } from './reducers'
import { logger } from './logger'
import { heartbeatAction } from './reducers/actions'
import {
    CPU_POLE_INTERVAL,
    API_URL,
    ENDPOINTS,
} from './constants'

const rootElement = document.getElementById('root')
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
)

export type LoadAverage = number
export type LoadSnapshot = {
    id: number;
    time: Date;
    color: string;
    load: LoadAverage;
}

const roundToHundredth = (num: number): number => Math.round(num * 100) / 100

const getColor = (load: number): string => `rgb(${Math.round(255 * load)}, 0, 0)`

const getAverageLoad = async (): Promise<LoadAverage> => {
    const { data: { load } } = (await axios.get(`${API_URL}/${ENDPOINTS.getCpuAverage}`))
    return roundToHundredth(load) as LoadAverage
}

let snapshotId = 0
const getLoadSnapshot = async (): Promise<LoadSnapshot> => {
    const time = new Date
    const load = await getAverageLoad()
    return {
        id: snapshotId++,
        color: getColor(load),
        time,
        load,
    }
}
const heartbeat = async (): Promise<void> => {
    logger('heartbeat start')
    const loadSnapshot = await getLoadSnapshot()
    store.dispatch(heartbeatAction(loadSnapshot))
}
heartbeat()

setInterval(() => {
    const isPaused = store.getState().isPaused
    if (!isPaused) {
        heartbeat()
    }
}, CPU_POLE_INTERVAL)



