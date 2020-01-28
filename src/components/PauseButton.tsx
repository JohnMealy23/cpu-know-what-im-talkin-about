import * as React from 'react'
import { store } from '../reducers'
import { pausedAction } from '../reducers/actions'

export const PauseButton = ({ isPaused }: { isPaused: boolean }) => {
    return <button onClick={() => store.dispatch(pausedAction())}>
        {isPaused ? 'Start' : 'Pause'}
    </button>
}
