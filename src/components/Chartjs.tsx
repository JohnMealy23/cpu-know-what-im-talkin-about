import * as React from 'react';
import Chart, { ChartPoint, ChartData } from 'chart.js';

type ChartUpdate = {
    data: number;
    backgroundColor: string;
    borderColor: string;
    label: Date;
}

type ChartResolve = (chart: ChartUpdateObj) => void
let deferred: ChartResolve
let chartPromise: Promise<ChartUpdateObj> = new Promise((resolve: ChartResolve) => deferred = resolve)

export const updateChart = ({
    data,
    backgroundColor,
    borderColor,
    label,
}: ChartUpdate) => {
    return chartPromise.then((dataset: ChartUpdateObj) => {
        dataset.data.push(data)
        dataset.backgroundColor.push(backgroundColor)
        dataset.borderColor.push(borderColor)
        dataset.labels.push(label)
        dataset.chart.update()
    })
}

export const ChartElem = React.memo(() => {
    const canvasId = 'myChart'
    Promise.resolve().then(() => {
        const chart = new Chart(canvasId, {
            type: 'line',
            data: {
                labels: [
                    // 'Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'
                ],
                datasets: [{
                    label: 'Processor Load',
                    data: [
                        // 12, 19, 3, 5, 2, 3
                    ],
                    backgroundColor: [
                        // 'rgba(255, 99, 132, 0.2)',
                        // 'rgba(54, 162, 235, 0.2)',
                        // 'rgba(255, 206, 86, 0.2)',
                        // 'rgba(75, 192, 192, 0.2)',
                        // 'rgba(153, 102, 255, 0.2)',
                        // 'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        // 'rgba(255, 99, 132, 1)',
                        // 'rgba(54, 162, 235, 1)',
                        // 'rgba(255, 206, 86, 1)',
                        // 'rgba(75, 192, 192, 1)',
                        // 'rgba(153, 102, 255, 1)',
                        // 'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        const datasets = chartTypeGuard(chart)
        if (datasets) {
            deferred(datasets)
        }
    })

    return <div>
        <canvas id={canvasId} width="400" height="400"></canvas>
    </div>

})

type ChartUpdateObj = {
    data: (number | null | undefined | ChartPoint)[];
    backgroundColor: (string | null | undefined | CanvasGradient | CanvasPattern | string[])[];
    borderColor: (string | null | undefined | CanvasGradient | CanvasPattern | string[])[];
    labels: Required<ChartData>['labels'];
    chart: Chart
}
const chartTypeGuard = (chart: Chart): ChartUpdateObj | false => {
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
