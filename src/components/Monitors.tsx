import * as React from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

import { Monitor } from './Monitor'
import { MonitorLabel } from './MonitorLabel'
import {
    getLatestSnapshot,
    getHighAndLowPeriods,
    LoadPeriod,
    LoadPeriods,
    getCpuRange
} from '../selectors'
import {
    LANGUAGE_AVERAGE_CPU_LABEL,
    LANGUAGE_CPU_CHANGE_OVER_TIME_LABEL,
    LANGUAGE_HEAVY_LOAD_HISTORY_LABEL,
    LANGUAGE_RECOVERY_HISTORY_LABEL,
    LANGUAGE_WARNING_ALERT,
    LANGUAGE_RECOVERY_ALERT,
    LANGUAGE_ALERT_LABEL
} from '../language'
import {
    COLOR_WARNING,
    COLOR_RECOVERY,
} from '../constants'
import { formatTime } from '../utils'
import { LoadSnapshot } from '..'

const MonitorsContainer = styled.div`
    width: 100%;
    text-align: center;
    padding-bottom: 15px;
    display: flex;
    ${({ backgroundColor }: { backgroundColor?: string }) => backgroundColor && css`
        background-color: backgroundColor;
    `}
`

const getAverageCpuMonitor = (): React.ReactElement => {
    const lastSnapshot = useSelector(getLatestSnapshot)
    const load = lastSnapshot ? lastSnapshot.load : 0
    return <Monitor
        children={<p>{load}</p>}
        label={LANGUAGE_AVERAGE_CPU_LABEL}
    ></Monitor>
}

// - How did the average CPU load change over a 10 minute window?
const getCpuRangeMonitor = (): React.ReactElement => {
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
const getHighsAndLowsMonitor = (highsAndLows: LoadPeriods): React.ReactElement => {

    const highPeriodElems = <StyledOl>
        {highsAndLows.highs.map(getPeriodElem)}
    </StyledOl>

    const lowPeriodElems = <StyledOl>
        {highsAndLows.lows.map(getPeriodElem)}
    </StyledOl>

    return <MonitorsContainer>
        <Monitor
            children={highPeriodElems}
            label={LANGUAGE_HEAVY_LOAD_HISTORY_LABEL}
        ></Monitor>
        <Monitor
            children={lowPeriodElems}
            label={LANGUAGE_RECOVERY_HISTORY_LABEL}
        ></Monitor>
    </MonitorsContainer>
}

const getWarningMonitor = (
    highsAndLows: LoadPeriods,
    latestSnapshot: LoadSnapshot
): JSX.Element => {

    let WarningMonitor

    // Check to see if a warning is needed:
    const warning = getWarning(highsAndLows, latestSnapshot)

    // If there is grounds for a warning, create the elements:
    if (warning) {
        WarningMonitor = <Monitor
            label={LANGUAGE_ALERT_LABEL}
            children={<p>{warning.text}</p>}
            color={warning.color}
        ></Monitor>
    } else {
        WarningMonitor = <span></span>
    }

    return WarningMonitor
}

type WarningInfo = {
    color: string;
    text: string;
}
const getWarning = (
    { highs, lows }: LoadPeriods,
    latestSnapshot: LoadSnapshot
): WarningInfo | null => {
    if (isInPeriod(highs, latestSnapshot)) {
        return {
            color: COLOR_WARNING,
            text: LANGUAGE_WARNING_ALERT
        }
    } else if (isInPeriod(lows, latestSnapshot)) {
        return {
            color: COLOR_RECOVERY,
            text: LANGUAGE_RECOVERY_ALERT
        }
    } else {
        return null
    }
}

const isInPeriod = (highs: LoadPeriod[], latestSnapshot: LoadSnapshot): boolean =>
    !!highs.length && highs[highs.length - 1].end === latestSnapshot


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
    const highsAndLows = useSelector(getHighAndLowPeriods)
    const latestSnapshot = useSelector(getLatestSnapshot)

    const averageCpuMonitor = getAverageCpuMonitor()
    const cpuRangeMonitor = getCpuRangeMonitor()
    const loadHistoryMonitors = getHighsAndLowsMonitor(highsAndLows)
    let warningMonitor
    if (latestSnapshot) {
        warningMonitor = getWarningMonitor(highsAndLows, latestSnapshot)
    } else {
        warningMonitor = <span></span>
    }
    return <div>
        <MonitorLabel>
            CPU Monitors
        </MonitorLabel>
        <MonitorsContainer>
            {averageCpuMonitor}
            {cpuRangeMonitor}
        </MonitorsContainer>
        {loadHistoryMonitors}
        {warningMonitor}
    </div>
}
