import {
    getSnapshots,
    getHighAndLowPeriods,
    getLatestSnapshot,
    getCpuRange,
    getIsPaused,
} from '../src/selectors'
import { LoadSnapshot } from '../src'
import { getMockLoads } from './mocks/getMockLoads'
import { State } from '../src/reducers'

let snapshots: LoadSnapshot[]
let state: State
let initialState: State
beforeEach(() => {
    snapshots = getMockLoads()
    initialState = {
        snapshots: [],
        isPaused: false
    }
    state = {
        snapshots,
        isPaused: false
    }
})

describe('selectors', () => {

    describe('getSnapshots', () => {
        it('should return snapshots', () => {
            const result = getSnapshots(state)
            expect(result).toBe(snapshots)
        })
    })

    describe('getHighAndLowPeriods', () => {
        it('should find periods of high CPU and recovery throughout the history', () => {
            const result = getHighAndLowPeriods(state)
            expect(result).toEqual({
                highs: [
                    {
                        end: {
                            color: "rgb(43, 0, 0)",
                            id: 12,
                            load: 0.21,
                            time: new Date('2020-01-30T13:57:18.573Z'),
                        },
                        start: {
                            color: "rgb(43, 0, 0)",
                            id: 7,
                            load: 0.25,
                            time: new Date('2020-01-30T13:57:08.572Z'),
                        },
                    }
                ],
                lows: [
                    {
                        end: {
                            color: "rgb(38, 0, 0)",
                            id: 6,
                            load: 0.2,
                            time: new Date('2020-01-30T13:57:06.572Z'),
                        },
                        start: {
                            color: "rgb(41, 0, 0)",
                            id: 0,
                            load: 0.18,
                            time: new Date('2020-01-30T13:56:54.571Z'),
                        },
                    },
                ]
            })
        })
    })

    describe('getLatestSnapshot', () => {
        it('should get the last snapshot to be entered', () => {
            const result = getLatestSnapshot(state)
            expect(result).toBe(state.snapshots[state.snapshots.length -1])
        })
        it('should return null when no snapshots are present', () => {
            const result = getLatestSnapshot(initialState)
            expect(result).toBe(null)
        })
    })

    describe('getCpuRange', () => {
        it('should get the highest and lowest loads in the history', () => {
            const result = getCpuRange(state)
            expect(result).toEqual({
               max: {
                 color: "rgb(41, 0, 0)",
                 id: 9,
                 load: 0.31,
                 time: new Date('2020-01-30T13:57:12.577Z'),
               },
               min: {
                 color: "rgb(38, 0, 0)",
                 id: 3,
                 load: 0.14,
                 time: new Date('2020-01-30T13:57:00.574Z'),
               },
             })
        })
    })

    describe('getIsPaused', () => {
        it('should retrieve isPaused from state', () => {
            const result = getIsPaused(state)
            expect(result).toBe(state.isPaused)
        })
    })
})
