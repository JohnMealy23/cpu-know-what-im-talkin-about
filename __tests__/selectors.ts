import {
    getSnapshots,
    getCpuAverage,
    getWarning,
    getLatestSnapshot,
    getCpuRange,
    getIsPaused,
    getHighsAndRecoveries,
} from '../src/state/selectors'
import { State } from '../src/state'
import { getMokeState } from './mocks/getMockState'

let state: State
beforeEach(() => {
    state = getMokeState()
})

describe('selectors', () => {
    describe('getSnapshots', () => {
        it('should return snapshots', () => {
            const result = getSnapshots(state)
            expect(result).toBe(state.snapshots.loads)
        })
    })

    describe('getCpuAverage', () => {
        it('should return the average value of all snapshot loads', () => {
            const result = getCpuAverage(state)
            expect(result).toBe(0.2)
        })
        it('should return 0 when there are no snapshots', () => {
            state.snapshots.loads = []
            const result = getCpuAverage(state)
            expect(result).toBe(0)
        })
    })

    describe('getWarning', () => {
        it('should return the warning state', () => {
            const result = getWarning(state)
            expect(result).toEqual({ 'active': false, type: null })
        })
    })

    describe('getLatestSnapshot', () => {
        it('should return the last snapshot entered', () => {
            const result = getLatestSnapshot(state)
            expect(result).toEqual({
                color: 'rgb(160, 160, 255)',
                id: 76,
                load: 0.17,
                time: new Date('2020-02-02T02:34:11.908Z'),
            })
        })
        it('should return null when no snapshots', () => {
            state.snapshots.loads = []
            const result = getLatestSnapshot(state)
            expect(result).toEqual(null)
        })
    })

    describe('getCpuRange', () => {
        it('should return the highest and lowest load objects', () => {
            const result = getCpuRange(state)
            expect(result).toEqual({
                max: {
                    color: 'rgb(255, 148, 148)',
                    id: 27,
                    load: 0.25,
                    time: new Date('2020-02-02T02:32:33.909Z'),
                },
                min: {
                    color: 'rgb(160, 160, 255)',
                    id: 39,
                    load: 0.16,
                    time: new Date('2020-02-02T02:32:57.907Z'),
                }
            })
        })
    })

    describe('getIsPaused', () => {
        it('should return paused state', () => {
            const result = getIsPaused(state)
            expect(result).toEqual(false)
        })
    })

    describe('getHighsAndRecoveries', () => {
        it('should return all periods meeting definition for high load or recovery', () => {
            const result = getHighsAndRecoveries(state)
            expect(result).toEqual({
                highs: [
                    {
                        end: {
                            color: 'rgb(255, 148, 148)',
                            id: 54,
                            load: 0.24,
                            time: new Date('2020-02-02T02:33:27.908Z'),
                        },
                        start: {
                            color: 'rgb(255, 148, 148)',
                            id: 44,
                            load: 0.21,
                            time: new Date('2020-02-02T02:33:07.907Z'),
                        },
                        type: 'HIGH_LOAD_FLAG',
                    },
                ],
                recoveries: [
                    {
                        end: {
                            color: 'rgb(160, 160, 255)',
                            id: 76,
                            load: 0.17,
                            time: new Date('2020-02-02T02:34:11.908Z'),
                        },
                        start: {
                            color: 'rgb(160, 160, 255)',
                            id: 62,
                            load: 0.19,
                            time: new Date('2020-02-02T02:33:43.908Z'),
                        },
                        type: 'RECOVERY_FLAG',
                    },
                ],
            })
        })
    })
})
