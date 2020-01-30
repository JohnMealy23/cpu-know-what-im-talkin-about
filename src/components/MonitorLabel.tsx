import styled, { css } from "styled-components";
import { COLOR_NOMINAL } from "../constants";

export const MonitorLabel = styled.div`
    text-align: center;
    border-bottom: 1px solid grey;
    background: rgb(100, 100, 100);
    padding: 15px 0;
    margin-bottom: 15px;
    width: 100%;
    ${({ color = COLOR_NOMINAL }: { color?: string}) => css`
        background: ${color}
    `}
`
