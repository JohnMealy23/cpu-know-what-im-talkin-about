import { snapshotReducer } from '../src/state/snapshots'
import { getMokeState } from './mocks/getMockState'
import { HEARTBEAT } from '../src/state/actions'
import * as constants from '../src/constants'
import { advanceTo } from 'jest-date-mock';

; (constants.HIGH_LOAD_THRESHOLD_CPU as any) = .2
    ; (constants.HIGH_LOAD_THRESHOLD_DURATION as any) = 10000
    ; (constants.RECOVERY_THRESHOLD_DURATION as any) = 10000
    ; (constants.CPU_POLE_INTERVAL as any) = 2000
    ; (constants.SNAPSHOT_LIFESPAN as any) = 100000

describe('snapshots reducer', () => {
    let mockState: any
    let mockHeartbeatAction: any
    const nextLoad = {
        id: 77,
        color: 'rgb(160, 160, 255)',
        time: new Date('2020-02-02T02:34:11.908Z'),
        load: 0.18
    }
    beforeAll(() => {
        advanceTo(nextLoad.time); // reset to date time.
    })
    beforeEach(() => {
        mockState = getMokeState().snapshots
        mockHeartbeatAction = {
            type: HEARTBEAT,
            data: nextLoad
        }
    })
    it('should add new loads to the end of the state array', () => {
        const result = snapshotReducer(mockState, mockHeartbeatAction)
        expect(result.loads[result.loads.length - 1]).toEqual(nextLoad)
    })
    it('should remove old items', () => {
        const oldLoad = {
            id: 26,
            color: 'rgb(255, 148, 148)',
            time: new Date('2020-02-02T02:32:29.909Z'),
            load: 0.25
        }
        mockState.loads.unshift(oldLoad)
        const result = snapshotReducer(mockState, mockHeartbeatAction)
        expect(result.loads.includes(oldLoad)).toEqual(false)
    })
    it('should compile all high periods and recovery periods', () => {
        const result = snapshotReducer(mockState, mockHeartbeatAction)
        // console.log(JSON.stringify(result.periods, null, 4))
        expect(result.periods).toEqual([
            {
                end: {
                    color: 'rgb(255, 148, 148)',
                    id: 54,
                    load: 0.24,
                    time: new Date('2020-02-02T02:33:27.908Z')
                },
                start: {
                    color: 'rgb(255, 148, 148)',
                    id: 44,
                    load: 0.21,
                    time: new Date('2020-02-02T02:33:07.907Z')
                },
                type: 'HIGH_LOAD_FLAG'
            },
            {
                start: {
                    color: 'rgb(160, 160, 255)',
                    id: 62,
                    load: 0.19,
                    time: new Date('2020-02-02T02:33:43.908Z')
                },
                end: {
                    color: 'rgb(160, 160, 255)',
                    id: 77,
                    load: 0.18,
                    time: new Date('2020-02-02T02:34:11.908Z')
                },
                type: 'RECOVERY_FLAG'
            }
        ])
    })
    it('should compile all high periods and recovery periods', () => {
        const result = snapshotReducer(mockState, mockHeartbeatAction)
        const initialWarning = getMokeState().snapshots.warning
        console.log(1, result.warning)
        expect(result.warning).not.toEqual(initialWarning)
        expect(result.warning).toEqual({
            active: true,
            type: 'RECOVERY_FLAG',
        })
    })
})

