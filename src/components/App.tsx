import * as React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../reducers'
import { PauseButton } from './PauseButton'
import { Chart } from './ChartContainer'
import styled from 'styled-components'

const AppContainerStyled = styled.div`
    width: 100%;
`

export const App = () => {
    const isPaused = useSelector((state: State): boolean => state.isPaused)
    return <AppContainerStyled>
        <PauseButton isPaused={isPaused}></PauseButton>
        <Chart></Chart>
    </AppContainerStyled>
}
