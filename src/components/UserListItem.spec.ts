import { beforeEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import UserListItem from './UserListItem.vue'
import type { User } from '@/api/randomuser/RandomUserResponse'

describe('UserListItem.vue', () => {
  let user: User

  beforeEach(() => {
    user = { login: { uuid: '1' }, name: { first: 'John', last: 'Doe' }, picture: { thumbnail: 'test.jpg' }, id: { value: '1' }, email: 'test@test.com', phone: '1234567890', location: { city: 'Test City', country: 'Test Country' } } as User
  })

  test('should render correctly when a user is provided', () => {
    const wrapper = mount(UserListItem, {
      props: {
        user
      }
    })
    expect(wrapper.html()).toContain('John Doe')
    expect(wrapper.html()).toContain('test@test.com')
    expect(wrapper.find('img').attributes('src')).toBe('test.jpg')
  })
})