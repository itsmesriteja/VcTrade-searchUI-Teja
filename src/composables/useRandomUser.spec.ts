import { test, vi, describe } from 'vitest'
import { useRandomUser } from './useRandomUser'

vi.mock('./useFetchUsers', () => ({
  useFetchUsers: vi.fn().mockImplementation(() => {
    return {
      data: {
        value: {
          results: [
            {
              name: {
                first: 'test',
                last: 'test',
              },
              login: {
                uuid: '1'
              }
            }
          ]
        }
      },
      isFetching: {
        value: false
      },
      error: {
        value: null
      }
    }
  })
}))

describe('useRandomUser', () => {
  test('loadMoreUsers from start', async ({ expect }) => {
    const store = {
      commit: vi.fn(),
      state: {
        fetchedUsers: [],
        selectedUser: null
      },
    }
    await useRandomUser(store as any)

    // Check if the fetched data was correctly committed to the store
    expect(store.commit).toHaveBeenCalledOnce()
  })

  test('loadMoreUsers manually via loadMoreUsers function', async ({ expect }) => {
    const store = {
      commit: vi.fn(),
      state: {
        fetchedUsers: [],
        selectedUser: null
      },
    }
    const { loadMoreUsers } = await useRandomUser(store as any)
    await loadMoreUsers()

    // Check if the fetched data was correctly committed to the store
    expect(store.commit).toHaveBeenCalledTimes(2)
  })
})