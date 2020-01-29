import * as React from 'react'
import { store } from '../reducers'
import { pausedAction } from '../reducers/actions'
import { getIsPaused } from '../selectors'
import { useSelector } from 'react-redux'

export const PauseButton = () => {
    const isPaused = useSelector(getIsPaused)
    return <button onClick={() => store.dispatch(pausedAction())}>
        {isPaused ? 'Start' : 'Pause'}
    </button>
}
