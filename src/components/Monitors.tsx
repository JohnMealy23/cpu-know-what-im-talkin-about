import * as React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { Monitor } from './Monitor'
import { MonitorLabel } from './MonitorLabel'
import {
    getLatestSnapshot,
    getHighAndLowPeriods,
    LoadPeriod
} from '../selectors'
import {
    LANGUAGE_AVERAGE_CPU_LABEL,
    LANGUAGE_CPU_CHANGE_OVER_TIME_LABEL,
    LANGUAGE_HEAVEY_LOAD_HISTORY_LABEL,
    LANGUAGE_RECOVERY_HISTORY_LABEL
} from '../language'
import { formatTime } from '../utils'

const MonitorsContainer = styled.div`
    border: 1px solid grey;
    width: 100%;
    text-align: center;
    padding-bottom: 15px;
    display: flex;
`

const getAverageCpuMonitor = (): React.ReactElement => {
    const lastSnapshot = useSelector(getLatestSnapshot)
    const load = lastSnapshot ? lastSnapshot.load : 0
    return <Monitor children={<p>{load}</p>} label={LANGUAGE_AVERAGE_CPU_LABEL}></Monitor>
}

// - How did the average CPU load change over a 10 minute window?
const getCpuRangeMonitor = (): React.ReactElement => {
    const lastSnapshot = useSelector(getLatestSnapshot)
    const load = lastSnapshot ? lastSnapshot.load : 0
    return <Monitor children={<p>{load}</p>} label={LANGUAGE_CPU_CHANGE_OVER_TIME_LABEL}></Monitor>
}

// - Has my computer been under heavy CPU load for 2 minutes or more? When? How many times?
// - A CPU is considered under high average load when it has exceeded 1 for 2 minutes or more.
const getHighsAndLowsMonitor = (): React.ReactElement => {
    const highsAndLows = useSelector(getHighAndLowPeriods)
    const highPeriodElems = <StyledOl>
        {highsAndLows.highs.map(getPeriodElem)}
    </StyledOl>
    const lowPeriodElems = <StyledOl>
        {highsAndLows.lows.map(getPeriodElem)}
    </StyledOl>
    return <MonitorsContainer>
        <Monitor children={highPeriodElems} label={LANGUAGE_HEAVEY_LOAD_HISTORY_LABEL}></Monitor>
        <Monitor children={lowPeriodElems} label={LANGUAGE_RECOVERY_HISTORY_LABEL}></Monitor>
    </MonitorsContainer>
}

const getPeriodElem = ({ start, end }: LoadPeriod) => (<li key={start.id}>
    <StyledOl>
        <li>Start: {formatTime(start.time)}</li>
        <li>end: {formatTime(end.time)}</li>
    </StyledOl>
</li>)

const StyledOl = styled.ol`
    margin: 8px;
    max-width: 350px;
    list-style: none;
`

export const Monitors = () => {

    const averageCpuMonitor = getAverageCpuMonitor()
    const cpuRangeMonitor = getCpuRangeMonitor()
    const loadHistoryMonitors = getHighsAndLowsMonitor()
    return <div>
        <MonitorLabel>
            CPU Monitors
        </MonitorLabel>
        <MonitorsContainer>
            {averageCpuMonitor}
            {cpuRangeMonitor}
        </MonitorsContainer>
        {loadHistoryMonitors}
    </div>
}
