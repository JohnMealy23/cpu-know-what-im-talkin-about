import * as React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../reducers'
import { PauseButton } from './PauseButton'
import { ChartElem } from './Chartjs'
import styled from 'styled-components'

const AppContainerStyled = styled.div`
    width: 100%;
`

export const App = () => {
    const isPaused = useSelector((state: State): boolean => state.isPaused)
    return <AppContainerStyled>
        <PauseButton isPaused={isPaused}></PauseButton>
        <ChartElem></ChartElem>
    </AppContainerStyled>
}
