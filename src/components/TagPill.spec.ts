import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TagPill from './TagPill.vue'

describe('TagPill.vue', () => {
  it('should render correctly when active is false', () => {
    const wrapper = mount(TagPill, {
      props: {
        active: false
      },
      slots: {
        default: 'Test Tag'
      }
    })
    expect(wrapper.html()).toContain('Test Tag')
    expect(wrapper.classes()).not.toContain('border')
  })

  it('should render correctly when active is true', () => {
    const wrapper = mount(TagPill, {
      props: {
        active: true
      },
      slots: {
        default: 'Test Tag'
      }
    })
    expect(wrapper.html()).toContain('Test Tag')
    expect(wrapper.classes()).toContain('border')
  })
})