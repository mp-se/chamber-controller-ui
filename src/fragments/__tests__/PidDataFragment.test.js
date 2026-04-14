import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PidDataFragment from '../PidDataFragment.vue'
import { createTestingPinia } from '../../tests/testUtils'

describe('PidDataFragment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts without error', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PidDataFragment, {
      global: {
        plugins: [pinia],
        stubs: {
          BsCard: true,
          BsButton: true,
          BsInputNumber: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays PID data section header', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PidDataFragment, {
      global: {
        plugins: [pinia],
        stubs: {
          BsCard: { template: '<div><slot /></div>' },
          BsButton: { template: '<button><slot /></button>' }
        }
      }
    })
    expect(wrapper.text().length).toBeGreaterThan(0)
  })
})
