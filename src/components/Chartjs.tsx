import * as React from 'react';
import Chart, { ChartPoint, ChartData } from 'chart.js';
import { formatTime } from '../utils';
import { useSelector } from 'react-redux';
import { getLatestSnapshot } from '../state/selectors';
import styled from 'styled-components';
import { LANGUAGE_CHART_LABEL } from '../language';

type ChartUpdate = {
    data: number;
    backgroundColor: string;
    borderColor: string;
    time: Date;
}

let chart: Chart

export const updateChart = ({
    data,
    backgroundColor,
    borderColor,
    time,
}: ChartUpdate) => {
    const dateString = formatTime(time)
    const dataset = chartTypeGuard(chart)
    if (dataset) {
        dataset.data.push(data)
        dataset.backgroundColor.push(backgroundColor)
        dataset.borderColor.push(borderColor)
        dataset.labels.push(dateString)
        dataset.chart.update()
    }
}

type ChartjsApi = {
    data: (number | null | undefined | ChartPoint)[];
    backgroundColor: (string | null | undefined | CanvasGradient | CanvasPattern | string[])[];
    borderColor: (string | null | undefined | CanvasGradient | CanvasPattern | string[])[];
    labels: Required<ChartData>['labels'];
    chart: Chart
}
const chartTypeGuard = (chart: Chart): ChartjsApi | false => {
    if (
        chart &&
        chart.data &&
        chart.data.labels &&
        Array.isArray(chart.data.labels) &&
        chart.data.datasets &&
        chart.data.datasets[0].data &&
        Array.isArray(chart.data.datasets[0].data) &&
        chart.data.datasets[0].backgroundColor &&
        Array.isArray(chart.data.datasets[0].backgroundColor) &&
        chart.data.datasets[0].borderColor &&
        Array.isArray(chart.data.datasets[0].borderColor)
    ) {
        return {
            data: chart.data.datasets[0].data,
            backgroundColor: chart.data.datasets[0].backgroundColor,
            borderColor: chart.data.datasets[0].borderColor,
            labels: chart.data.labels,
            chart,
        }
    } else {
        return false
    }
}

const createChart = (canvasId: string) => {
    chart = new Chart(canvasId, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: LANGUAGE_CHART_LABEL,
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 2
            }]
        },
        options: {
            elements: { 
                line: { 
                    fill: false 
                } 
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


const ChartCanvas = () => {
    const canvasId = 'myChart'
    React.useEffect(() => {
        createChart(canvasId)
    })
    return <canvas id={canvasId}></canvas>
}

const StyledChartCanvas = styled(ChartCanvas)`
    height: 400px;
    width: 100%;
`

const MemoizedChartCanvas = React.memo(StyledChartCanvas);

export const ChartElem = () => {
    const loadSnapshot = useSelector(getLatestSnapshot)
    if (loadSnapshot) {
        updateChart({
            data: loadSnapshot.load,
            borderColor: loadSnapshot.color,
            backgroundColor: loadSnapshot.color,
            time: loadSnapshot.time
        })
    }
    return <MemoizedChartCanvas></MemoizedChartCanvas>
}
