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
    COLOR_NOMINAL,
} from '../constants'
import { formatTime } from '../utils'
import { LoadSnapshot } from '..'

const MonitorsContainer = styled.div`
    width: 100%;
    text-align: center;
    padding-bottom: 15px;
    display: flex;
    ${({ backgroundColor }: { backgroundColor?: string }) => backgroundColor && css`
        background-color: ${backgroundColor};
    `}
`

const AverageCpuMonitor = ({ 
    latestSnapshot 
}: { 
    latestSnapshot: LoadSnapshot | null 
}): React.ReactElement => {
    const load = latestSnapshot ? latestSnapshot.load : 0
    return <Monitor
        children={<p>{load}</p>}
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
const HighsAndLowsMonitor = ({ highsAndLows }: { highsAndLows: LoadPeriods }): React.ReactElement => {

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

const WarningMonitor = ({
    highsAndLows,
    latestSnapshot,
}: {
    highsAndLows: LoadPeriods,
    latestSnapshot: LoadSnapshot
}): JSX.Element => {

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
    
    // Test if current snapshot is in the current high or low period
    if (isInPeriod(highs, latestSnapshot)) {
        return {
            color: COLOR_WARNING,
            text: LANGUAGE_WARNING_ALERT
        }
    } else if (
        isInPeriod(lows, latestSnapshot) &&
        highs.length
    ) {
        return {
            color: COLOR_RECOVERY,
            text: LANGUAGE_RECOVERY_ALERT
        }
    } else {
        return null
    }
}

// Check to see that the last period has a start but no end, or that its end
// matches the last snapshot taken:
const isInPeriod = (periods: LoadPeriod[], latestSnapshot: LoadSnapshot): boolean =>
    (
        periods.length && 
        periods[periods.length - 1].start &&
        (
            !periods[periods.length - 1].end ||
            periods[periods.length - 1].end === latestSnapshot
        )
    )


const trimIncomplete = (periods: LoadPeriod[]): LoadPeriod[] => periods.filter(({ start, end }) => start && end)

const getPeriodElem = ({ start, end }: LoadPeriod) => (<li key={start.id}>
    <StyledOl>
        <li>Start: {formatTime(start.time)}</li>
        <li>end: {formatTime(end.time)}</li>
    </StyledOl>
</li>)

const StyledOl = styled.ol`
    margin: 0;
    padding: 0;
    width: 100%;
    list-style: none;
    border-top: 1px solid ${COLOR_NOMINAL};
`

export const Monitors = () => {
    const highsAndLows = useSelector(getHighAndLowPeriods)
    const latestSnapshot = useSelector(getLatestSnapshot)

    let warningMonitor
    if (latestSnapshot) {
        warningMonitor = <WarningMonitor highsAndLows={highsAndLows} latestSnapshot={latestSnapshot}></WarningMonitor>
    } else {
        warningMonitor = <span></span>
    }

    // We kept the partial periods to detect if we were still in 
    const highsAndLowsComplete = {
        highs: trimIncomplete(highsAndLows.highs),
        lows: trimIncomplete(highsAndLows.lows)
    }
    const averageCpuMonitor = <AverageCpuMonitor latestSnapshot={latestSnapshot}></AverageCpuMonitor>
    const cpuRangeMonitor = <CpuRangeMonitor></CpuRangeMonitor>
    const loadHistoryMonitors = <HighsAndLowsMonitor highsAndLows={highsAndLowsComplete}></HighsAndLowsMonitor>
    
    return <div>
        <MonitorLabel>
            CPU Monitors
        </MonitorLabel>
        <MonitorsContainer>
            {averageCpuMonitor}
            {warningMonitor}
            {cpuRangeMonitor}
        </MonitorsContainer>
        {loadHistoryMonitors}
    </div>
}
