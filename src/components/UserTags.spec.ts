import { beforeEach, describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Store, createStore } from 'vuex'
import UserTags from './UserTags.vue'
import { key, type State } from '@/store'
import type { User } from '@/api/randomuser/RandomUserResponse'

describe('UserTags.vue', () => {
  let store: Store<State>
  const user: User = { login: { uuid: '1' }, name: { first: 'John', last: 'Doe' }, picture: { thumbnail: 'test.jpg' }, id: { value: '1' }, email: 'test@test.com', phone: '1234567890', location: { city: 'Test City', country: 'Test Country' } } as User

  const addTagToUser = vi.fn()
  const removeTag = vi.fn()
  const updateTag = vi.fn()

  const storeState = {
    state: {
      selectedUser: user,
      userTags: { '1': ['tag1', 'tag2'] },
      tags: ['tag1', 'tag2', 'tag3'],
      fetchedUsers: [],
      favoriteUsers: [],
    },
    getters: {
      selectedUser: (state: State) => state.selectedUser,
      userTags: (state: State) => state.userTags
    },
    mutations: {
      addTagToUser,
      removeTag,
      updateTag,
    }
  }

  beforeEach(() => {
    store = createStore<State>(storeState)
  })

  test('should render correctly when a user is selected', () => {
    const wrapper = mount(UserTags, {
      global: {
        plugins: [[store, key]]
      }
    })
    expect(wrapper.html()).toContain('tag1')
    expect(wrapper.html()).toContain('tag2')
  })

  test('should add a new tag to the user', async () => {
    const wrapper = mount(UserTags, {
      global: {
        plugins: [[store, key]]
      }
    })
    const input = wrapper.find('[data-test="add-tag-input"]')
    expect(input.exists()).toBe(true)
    await input.setValue('tag4')
    await wrapper.find('[data-test="add-tag-button"]').trigger('click')
    expect(addTagToUser).toHaveBeenLastCalledWith(storeState.state, { user, tag: 'tag4' })
  })

  test('should remove a tag from the user', async () => {
    const wrapper = mount(UserTags, {
      global: {
        plugins: [[store, key]]
      }
    })
    const removeButton = wrapper.find('[data-test="remove-tag-button"]')
    expect(removeButton.exists()).toBe(true)
    await removeButton.trigger('click')
    expect(removeTag).toHaveBeenLastCalledWith(storeState.state, { uuid: '1', tag: 'tag1' })
  })

  test('should update a tag from the user', async () => {
    const wrapper = mount(UserTags, {
      global: {
        plugins: [[store, key]]
      }
    })
    const updateButtonOff = wrapper.find('[data-test="update-tag-button-off"]')
    expect(updateButtonOff.exists()).toBe(true)
    await updateButtonOff.trigger('click')

    const input = wrapper.find('[data-test="update-tag-input"]')
    expect(input.exists()).toBe(true)
    await input.setValue('tag2')

    const updateButtonOn = wrapper.find('[data-test="update-tag-button-on"]')
    expect(updateButtonOn.exists()).toBe(true)
    await updateButtonOn.trigger('click')

    expect(updateTag).toHaveBeenLastCalledWith(storeState.state, { uuid: '1', oldTag: 'tag1', newTag: 'tag2' })
  })
})