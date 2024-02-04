import { afterEach, expect, test, vi, describe } from 'vitest'
import { useFetchUsers } from './useFetchUsers'

const mockedResults = [
  {
    name: {
      first: 'test',
      last: 'test',
    },
    login: {
      uuid: '1'
    }
  }
];

vi.mock('@/api/randomuser', () => ({
  getFetchUsersURL: vi.fn().mockImplementation((page) => {
    return `page=${page}`
  })
}))
vi.mock('@vueuse/core', () => ({
  useFetch: vi.fn().mockImplementation((url) => {
    return {
      get: vi.fn().mockImplementation(() => {
        return {
          json: vi.fn().mockImplementation(() => {
            return {
              results: mockedResults
            }
          })
        }
      })
    }
  })
}))


describe('useFetchUsers', () => {

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should return a list of users', async () => {
    const result = await useFetchUsers(1)
    expect(result).toEqual({ results: mockedResults })
  })
})