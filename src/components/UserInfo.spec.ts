import { beforeEach, describe, expect, vi, test } from 'vitest'
import { mount } from '@vue/test-utils'
import UserInfo from './UserInfo.vue'
import { Store, createStore } from 'vuex'
import { key } from '@/store'
import type { State } from '@/store'
import type { User } from '@/api/randomuser/RandomUserResponse'

describe('UserInfo.vue', () => {
  let store: Store<State>
  let user: User

  const toggleFavorite = vi.fn()

  beforeEach(() => {
    user = {
      login: { uuid: '1' },
      name: { first: 'john', last: 'doe' },
      picture: { large: 'test.jpg' },
      id: { value: '1' },
      email: 'test@test.com',
      phone: '1234567890',
      location: { city: 'Test City', country: 'Test Country' },
      dob: { age: 24 }
    } as User
    store = createStore<State>({
      state: {
        selectedUser: user,
        favoriteUsers: [],
        fetchedUsers: [],
        tags: [],
        userTags: {}
      },
      getters: {
        selectedUser: state => state.selectedUser,
        favoriteUsers: state => state.favoriteUsers,
        fetchedUsers: state => state.fetchedUsers,
        tags: state => state.tags,
        userTags: state => state.userTags,
      },
      mutations: {
        toggleFavorite,
      }
    })
  })

  test('should render correctly when a user is selected', () => {
    const wrapper = mount(UserInfo, {
      global: {
        plugins: [[store, key]],
      }
    })
    expect(wrapper.html()).toContain('John Doe')
    expect(wrapper.html()).toContain('test@test.com')
    expect(wrapper.html()).toContain(24)
    expect(wrapper.html()).toContain('Test Country')
    expect(wrapper.html()).toContain('Test City')
  })

  test('should render correctly when no user is selected', () => {
    store.state.selectedUser = null
    const wrapper = mount(UserInfo, {
      global: {
        plugins: [[store, key]],
      }
    })
    expect(wrapper.html()).toContain('Please select a user to proceed further')
  })

  test('should render correctly when a user is selected and is a favorite', () => {
    store.state.favoriteUsers = [user]
    const wrapper = mount(UserInfo, {
      global: {
        plugins: [[store, key]],
      }
    })
    expect(wrapper.find('[data-test="favorite"]').exists()).toBe(true)
  })

  test('should render correctly when a user is selected and is not a favorite', () => {
    store.state.favoriteUsers = []
    const wrapper = mount(UserInfo, {
      global: {
        plugins: [[store, key]],
      }
    })
    expect(wrapper.find('[data-test="no-favorite"]').exists()).toBe(true)
  })

  test('should toggle favorite when favorite button is clicked', () => {
    store.state.favoriteUsers = []
    const wrapper = mount(UserInfo, {
      global: {
        plugins: [[store, key]],
      }
    })
    wrapper.find('[data-test="no-favorite"]').trigger('click')
    expect(toggleFavorite).toHaveBeenCalledWith(store.state, user)
  })
})