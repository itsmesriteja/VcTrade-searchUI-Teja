import { beforeEach, describe, expect, vi, test, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import UserList from './UserList.vue'
import { Store, createStore } from 'vuex'
import { key } from '@/store'
import type { State } from '@/store'
import type { User } from '@/api/randomuser/RandomUserResponse'
import { defineComponent, ref } from 'vue'

vi.mock('@/composables/useRandomUser', () => ({
  useRandomUser: () => ({
    loadMoreUsers: vi.fn(),
    isFetching: ref(false),
    error: ref(null),
    randomUserError: ref(null)
  })
}))

describe('UserList.vue', () => {
  let store: Store<State>
  let user: User
  let user2: User

  beforeEach(() => {
    user = {
      login: { uuid: '1' },
      name: { first: 'john', last: 'doe' },
      picture: { large: 'john.jpg' },
      id: { value: '1' },
      email: 'john@doe.com',
      phone: '1234567890',
      location: { city: 'John City', country: 'John Country' },
      gender: 'male',
    } as User
    user2 = {
      login: { uuid: '2' },
      name: { first: 'jane', last: 'doe' },
      picture: { large: 'jane.jpg' },
      id: { value: '2' },
      email: 'jane@doe.com',
      phone: '0987654321',
      location: { city: 'Jane City', country: 'Jane Country' },
      gender: 'female',
    } as User
    store = createStore<State>({
      state: {
        fetchedUsers: [user, user2],
        favoriteUsers: [],
        selectedUser: null,
        tags: [],
        userTags: {}
      },
      getters: {
        fetchedUsers: state => state.fetchedUsers,
        favoriteUsers: state => state.favoriteUsers,
        selectedUser: state => state.selectedUser,
        tags: state => state.tags,
        userTags: state => state.userTags,
      },
      mutations: {
        setSelectedUser: vi.fn()
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should render correctly when no user is fetched', async () => {
    const wrapper = mount(defineComponent(
      {
        template: '<Suspense><UserList /></Suspense>',
        components: { UserList }
      }
    ), {
      global: {
        plugins: [[store, key]]
      }
    })
    await flushPromises()
    expect(wrapper.html()).toContain('Load more')
  })

  test('should render correctly when a user is fetched', async () => {
    const wrapper = mount(defineComponent(
      {
        template: '<Suspense><UserList /></Suspense>',
        components: { UserList }
      }
    ), {
      global: {
        plugins: [[store, key]]
      }
    })
    await flushPromises()
    expect(wrapper.html()).toContain('John Doe')
    expect(wrapper.html()).toContain('john@doe.com')
  })

  test('should search for a user', async () => {
    const wrapper = mount(defineComponent(
      {
        template: '<Suspense><UserList /></Suspense>',
        components: { UserList }
      }
    ), {
      global: {
        plugins: [[store, key]]
      }
    })
    await flushPromises()
    const input = wrapper.find('input')
    await input.setValue('john')
    expect(wrapper.html()).toContain('John Doe')
    expect(wrapper.html()).not.toContain('Jane Doe')
  })

  test('should filter for favorite users', async () => {
    store.state.favoriteUsers = [user]
    const wrapper = mount(defineComponent(
      {
        template: '<Suspense><UserList /></Suspense>',
        components: { UserList }
      }
    ), {
      global: {
        plugins: [[store, key]]
      }
    })
    await flushPromises()
    wrapper.find('[data-test="filter-favorite-off"]').trigger('click')
    expect(wrapper.html()).toContain('John Doe')
  })

  test('should filter for gender male', async () => {
    const wrapper = mount(defineComponent(
      {
        template: '<Suspense><UserList /></Suspense>',
        components: { UserList }
      }
    ), {
      global: {
        plugins: [[store, key]]
      }
    })
    await flushPromises()
    await wrapper.find('[data-test="filter-gender-male"]').trigger('click')
    expect(wrapper.html()).toContain('John Doe')
    expect(wrapper.html()).not.toContain('Jane Doe')
  })



  test('should filter for gender female', async () => {
    const wrapper = mount(defineComponent(
      {
        template: '<Suspense><UserList /></Suspense>',
        components: { UserList }
      }
    ), {
      global: {
        plugins: [[store, key]]
      }
    })
    await flushPromises()
    await wrapper.find('[data-test="filter-gender-female"]').trigger('click')
    expect(wrapper.html()).not.toContain('John Doe')
    expect(wrapper.html()).toContain('Jane Doe')
  })

  test('should filter for tags', async () => {
    store.state.tags = ['test']
    store.state.userTags = { '1': ['test'] }
    const wrapper = mount(defineComponent(
      {
        template: '<Suspense><UserList /></Suspense>',
        components: { UserList }
      }
    ), {
      global: {
        plugins: [[store, key]]
      }
    })
    await flushPromises()
    await wrapper.find('[data-test="filter-tag-test"]').trigger('click')
    expect(wrapper.html()).toContain('John Doe')
    expect(wrapper.html()).not.toContain('Jane Doe')
  })

})