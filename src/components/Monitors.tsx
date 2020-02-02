import * as React from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

import { Monitor } from './Monitor'
import { MonitorLabel } from './MonitorLabel'
import {
    getCpuRange,
    getHighsAndRecoveries,
    getCpuAverage
} from '../state/selectors'
import {
    LANGUAGE_AVERAGE_CPU_LABEL,
    LANGUAGE_CPU_CHANGE_OVER_TIME_LABEL,
    LANGUAGE_HEAVY_LOAD_HISTORY_LABEL,
    LANGUAGE_RECOVERY_HISTORY_LABEL,
} from '../language'
import {
    COLOR_NOMINAL,
} from '../constants'
import { formatTime } from '../utils'
import { WarningMonitor } from './Alert'
import { LoadPeriod } from '../state/snapshots'

const MonitorsContainer = styled.div`
    width: 100%;
    text-align: center;
    padding-bottom: 15px;
    display: flex;
    ${({ backgroundColor }: { backgroundColor?: string }) => backgroundColor && css`
        background-color: ${backgroundColor};
    `}
`

const AverageCpuMonitor = (): React.ReactElement => {
    const averageLoad = useSelector(getCpuAverage)
    return <Monitor
        children={<p>{averageLoad}</p>}
        label={LANGUAGE_AVERAGE_CPU_LABEL}
    ></Monitor>
}

// - How did the average CPU load change over a 10 minute window?
const CpuRangeMonitor = (): React.ReactElement => {
    const minMax = useSelector(getCpuRange)

    const content = <div>
        <p>
            Max: {minMax.max ? minMax.max.load : 0}
        </p>
        <p>
            Min: {minMax.min ? minMax.min.load : 0}
        </p>
    </div>

    return <Monitor
        children={content}
        label={LANGUAGE_CPU_CHANGE_OVER_TIME_LABEL}
    ></Monitor>
}

// - Has my computer been under heavy CPU load for 2 minutes or more? When? How many times?
// - A CPU is considered under high average load when it has exceeded 1 for 2 minutes or more.
const HighsAndLowsMonitor = (): React.ReactElement => {
    const { highs, recoveries } = useSelector(getHighsAndRecoveries)
    return <MonitorsContainer>
        {!!highs.length && <PeriodsMonitor 
            periods={highs} 
            label={LANGUAGE_HEAVY_LOAD_HISTORY_LABEL}
        ></PeriodsMonitor>}
        {!!recoveries.length && <PeriodsMonitor 
            periods={recoveries} 
            label={LANGUAGE_RECOVERY_HISTORY_LABEL}
        ></PeriodsMonitor>}
    </MonitorsContainer>
}

const PeriodsMonitor = ({ periods, label }: { periods: LoadPeriod[], label: string }) => {
    const periodElems = <StyledOl>
        {periods.map(getPeriodElem)}
    </StyledOl>

    return <Monitor
        children={periodElems}
        label={label}
    ></Monitor>
}

const getPeriodElem = ({ start, end }: LoadPeriod) => {
    if (!start) {
        return <li></li>
    } else {
        return <li key={start.id}>
            <StyledOl>
                <li>Start: {formatTime(start.time)}</li>
                <li>end: {end ? formatTime(end.time) : 'TBD'}</li>
            </StyledOl>
        </li>
    }
}

const StyledOl = styled.ol`
    margin: 0;
    padding: 0;
    width: 100%;
    list-style: none;
    border-top: 1px solid ${COLOR_NOMINAL};
`

export const Monitors = () => {
    return <div>
        <MonitorLabel>
            CPU Monitors
        </MonitorLabel>
        <MonitorsContainer>
            <AverageCpuMonitor></AverageCpuMonitor>
            <WarningMonitor></WarningMonitor>
            <CpuRangeMonitor></CpuRangeMonitor>
        </MonitorsContainer>
        <HighsAndLowsMonitor></HighsAndLowsMonitor>
    </div>
}
