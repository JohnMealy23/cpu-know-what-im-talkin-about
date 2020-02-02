import React from 'react'
import { Monitor } from './Monitor'
import { LANGUAGE_ALERT_LABEL, LANGUAGE_WARNING_ALERT, LANGUAGE_RECOVERY_ALERT, LANGUAGE_RECOVERY_HISTORY_LABEL } from '../language'
import { COLOR_WARNING, COLOR_RECOVERY, HIGH_LOAD_FLAG } from '../constants'
import { useSelector } from 'react-redux'
import { getWarning } from '../state/selectors'
import { dismissWarningAction } from '../state/actions'
import { store } from '../state'

export const WarningMonitor = (): JSX.Element => {
    const warning = useSelector(getWarning)
    let WarningMonitor

    // If the there is need for an alert, and the user hasn't dismissed it
    // fire up an alert box:
    if (warning.active) {
        const dismissAlert = () => store.dispatch(dismissWarningAction())
        const dismissButton = <button onClick={dismissAlert}>Dismiss</button>
        if (warning.type === HIGH_LOAD_FLAG) {
            const content = <div>
                <p>{LANGUAGE_WARNING_ALERT}</p>
                {dismissButton}
            </div>
            WarningMonitor = <Monitor
                label={LANGUAGE_ALERT_LABEL}
                children={content}
                color={COLOR_WARNING}
            ></Monitor>
        } else {
            const content = <div>
            <p>{LANGUAGE_RECOVERY_ALERT}</p>
                {dismissButton}
            </div>
            WarningMonitor = <Monitor
                label={LANGUAGE_RECOVERY_HISTORY_LABEL}
                children={content}
                color={COLOR_RECOVERY}
            ></Monitor>
        }
    } else {
        // If no need for a warning, create a default elem
        WarningMonitor = <span></span>
    }

    return WarningMonitor
}
