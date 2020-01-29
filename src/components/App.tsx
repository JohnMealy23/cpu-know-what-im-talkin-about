import * as React from 'react'
import { PauseButton } from './PauseButton'
import { ChartElem } from './Chartjs'
// import { ChartOuterContainerStyled } from './ChartContainer'
import styled from 'styled-components'
import { Monitors } from './Monitors'

const AppContainerStyled = styled.div`
    width: 100%;
`

export const App = () => {
    return <AppContainerStyled>
        <Monitors></Monitors>
        <PauseButton></PauseButton>
        <ChartElem></ChartElem>
    </AppContainerStyled>
}
