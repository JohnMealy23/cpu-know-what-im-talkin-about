import axios from 'axios'
import * as React from 'react';
import { Provider } from 'react-redux'
import * as ReactDOM from 'react-dom'

import { 
    CPU_POLE_INTERVAL,
    API_URL,
    ENDPOINTS,
} from './constants'
import { logger } from './logger'
import { store } from './reducers'
import { heartbeatAction } from './reducers/actions'
import { App } from './components/App'
import { heavyLoadSnapshots } from './selectors/heavyLoadSnapshots'
import { updateChart } from './components/Chartjs';

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
let snapshotId = 0
export const getSnapshot = (load: number, time: Date = new Date): LoadSnapshot => ({
    id: snapshotId++,
    color: getColor(load),
    time,
    load,
})

const roundToHundredth = (num: number): number => Math.round(num * 100)/100

const getColor = (load: number): string => `rgb(${Math.round(255 * load)}, 0, 0);`

const getAverageLoad = async (): Promise<LoadAverage> => {
    const { data: { load } } = (await axios.get(`${API_URL}/${ENDPOINTS.getCpuAverage}`))
    return roundToHundredth(load) as LoadAverage
}

const heartbeat = async (): Promise<void> => {
    logger('heartbeat start')
    const time = new Date
    const load = await getAverageLoad()
    const loadSnapshot = getSnapshot(load, time)
    store.dispatch(heartbeatAction(loadSnapshot))
    updateChart({
        data: loadSnapshot.load,
        borderColor: loadSnapshot.color,
        backgroundColor: loadSnapshot.color,
        label: loadSnapshot.time
    })
    const state = store.getState()
    // const heavyLoads = heavyLoadSnapshots(state.snapshot)
    logger({ state, loadSnapshot })
}
setInterval(() => {
    const isPaused = store.getState().isPaused
    if (!isPaused) {
        heartbeat()
    }
}, CPU_POLE_INTERVAL)



