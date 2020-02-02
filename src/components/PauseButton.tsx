import * as React from 'react'
import { store } from '../state'
import { pausedAction } from '../state/actions'
import { getIsPaused } from '../state/selectors'
import { useSelector } from 'react-redux'

export const PauseButton = () => {
    const isPaused = useSelector(getIsPaused)
    return <button onClick={() => store.dispatch(pausedAction())}>
        {isPaused ? 'Start' : 'Pause'}
    </button>
}
