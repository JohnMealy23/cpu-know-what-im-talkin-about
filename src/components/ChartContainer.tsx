import * as React from 'react'
import styled, { css } from 'styled-components'
import { LoadSnapshot } from '..';
import { State } from '../reducers';
import { useSelector } from 'react-redux';
import { BAR_WIDTH, CHART_HEIGHT } from '../constants'

const Bar = styled.div`
  background: transparent;
  width: ${BAR_WIDTH}px;
  ${({ color, load }: { color: string; load: number }) => css`
    background: ${color};
    margin-top: ${CHART_HEIGHT - (load * 200)}px;
    height: ${load * 200}px;
  `}
`;

const DateDivStyled = styled.div`
    transform: rotate(90deg);
    position: absolute;
    bottom: -16px;
    font-size: 0.7em;
    width: 100%;
    text-align: center;
`
const LoadDivStyled = styled.div`
    position: absolute;
    bottom: 4px;
    font-size: 0.6em;
    color: white;
    width: 100%;
    text-align: center;
`

const BarContainer = ({ id, time, color, load, className }: LoadSnapshot & { className?: string }) => {

    const el = (<div className={className}>
        <Bar key={id} {...{ color, load }}></Bar>
        <LoadDivStyled>{Math.round(load * 100)}</LoadDivStyled>
        <DateDivStyled>
            {id}&nbsp;{time.getHours()}:{time.getMinutes()}:{time.getSeconds()}
        </DateDivStyled>
    </div>)

    // Memoize, as these will never change:
    return React.useMemo(() => el, [id])
}
export const BarContainerStyled = styled(BarContainer)`
    float: right;
    position: relative;
`

type ChartContainerFn = (chartContainerConfig?: { className?: string }, children?: React.HTMLProps<HTMLInputElement>[]) => any
const ChartInnerContainer: ChartContainerFn = (config = {}) => {
    const snapshots = useSelector((state: State): LoadSnapshot[] => state.snapshots)
    return <div className={config.className || ''}>
        {snapshots
            .sort(({ id: first }, { id: next }) => first > next ? -1 : 1)
            .map((snapshot: LoadSnapshot) => {
                return <BarContainerStyled key={snapshot.id} {...snapshot}></BarContainerStyled>
            })
        }
    </div>
}

export const ChartInnerContainerStyled = styled(ChartInnerContainer)`
    font-family: monospace;
    position: relative;
    ${({ width, marginRight }: { width: number, marginRight: number }) => css`
        width: ${width}px;
        margin-right: ${marginRight}px;
    `}
    float: right;
`
export const ChartOuterContainerStyled = styled.div`
    position: relative;
    height: ${CHART_HEIGHT}px;
    padding-bottom: 74px;
    margin: 0 4%;
    align-items: right;
    overflow-x: scroll;
    overflow-y: hidden;
`

const getInnerWidth = (snapshots: LoadSnapshot[]): number => {
    return (snapshots.length + 1) * BAR_WIDTH
}

export const Chart = () => {
    
    const [marginRight, setMarginRight] = React.useState(0);

    const snapshots = useSelector((state: State): LoadSnapshot[] => state.snapshots)

    const scrollLeft = () => {
        const chartWidth = getInnerWidth(snapshots)
        let newMargin = marginRight + (BAR_WIDTH * -1)
        if (Math.abs(newMargin) > chartWidth) {
            newMargin = chartWidth
        }
        setMarginRight(newMargin)
    }
    const scrollRight = () => {
        let newMargin = marginRight + BAR_WIDTH
        if (newMargin > 0) {
            newMargin = 0
        }
        setMarginRight(newMargin)
    }

    return <div>
        <ChartOuterContainerStyled>
            <div onClick={() => scrollLeft()}> L </div>
            <div onClick={() => scrollRight()}> R </div>
            <ChartInnerContainerStyled width={getInnerWidth(snapshots)} marginRight={marginRight}>
            </ChartInnerContainerStyled>
        </ChartOuterContainerStyled>
    </div>
}
