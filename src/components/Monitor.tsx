import * as React from 'react'
import styled from 'styled-components'
import { MonitorLabel } from './MonitorLabel'

const MonitorContainer = styled.div`
    border: 1px solid grey;
    width: 100%;
    text-align: center;
    padding-bottom: 15px;
    flex: 1;
`

export const Monitor = ({
    label, children,
}: {
    label: string,
    children: JSX.Element,
}) => (
    <MonitorContainer>
        <MonitorLabel>
            {label}
        </MonitorLabel>
        {children}
    </MonitorContainer>
)
