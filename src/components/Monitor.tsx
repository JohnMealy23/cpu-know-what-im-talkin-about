import * as React from 'react'
import styled, { css } from 'styled-components'
import { MonitorLabel } from './MonitorLabel'
import { COLOR_NOMINAL } from '../constants'

const MonitorContainer = styled.div`
    border: 1px solid;
    margin: 0 15px;
    width: 100%;
    text-align: center;
    padding-bottom: 15px;
    flex: 1;
    ${({ borderColor = COLOR_NOMINAL }: { borderColor: string }) => css`
        border-color: ${borderColor}
    `}
`

export const Monitor = ({
    label, children, color = COLOR_NOMINAL
}: {
    label: string,
    children: JSX.Element,
    color?: string
}) => (
    <MonitorContainer borderColor={color}>
        <MonitorLabel color={color}>
            {label}
        </MonitorLabel>
        {children}
    </MonitorContainer>
)
