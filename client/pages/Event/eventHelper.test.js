import { getEvent } from './eventHelper'
import { SET_WAITING, CLEAR_WAITING } from '../../actions/waiting'
import { dispatch } from '../../store'

jest.mock('../../store')

afterEach(() => {
  return jest.resetAllMocks()
})

describe('getEvent', () => {
  describe('-> GET /events/:id api call success', () => {
    it('dispatches with the correct event action', () => {
      function consume (path) {
        expect(path).toMatch('2')
        return Promise.resolve({
          body: {
            gardenName: 'test name',
            gardenAddress: 'test address',
            title: 'test event',
            date: '2021-04-30',
            volunteersNeeded: 3,
            description: 'wow great description',
            fake: 'asdf'
          }
        })
      }

      return getEvent(2, consume)
        .then((event) => {
          expect(dispatch).toHaveBeenCalledWith({ type: SET_WAITING })
          expect(dispatch).toHaveBeenCalledWith({
            type: CLEAR_WAITING
          })
          expect(event.title).toBe('test event')
          expect(event).not.toHaveProperty('fake')
          return null
        })
    })
  })

  describe('-> GET /event/:id api call rejection', () => {
    it('dispatches error correctly', () => {
      function consume () {
        return Promise.reject(new Error('mock error'))
      }
      return getEvent(null, consume)
        .then(() => {
          expect(dispatch.mock.calls[1][0].errorMessage).toBe('mock error')
          return null
        })
    })
  })
})
