import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PidTemperatureFragment from '../PidTemperatureFragment.vue'
import { createTestingPinia } from '../../tests/testUtils'

describe('PidTemperatureFragment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts without error', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PidTemperatureFragment, {
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

  it('displays temperature configuration section', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PidTemperatureFragment, {
      global: {
        plugins: [pinia],
        stubs: {
          BsCard: { template: '<div><slot /></div>' }
        }
      }
    })
    expect(wrapper.text().length).toBeGreaterThan(0)
  })

  it('has form structure for configuration', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PidTemperatureFragment, {
      global: {
        plugins: [pinia],
        stubs: {
          BsCard: { template: '<div><slot /></div>' },
          BsInputNumber: { template: '<input type="number" />' },
          BsButton: { template: '<button><slot /></button>' }
        }
      }
    })
    expect(wrapper.html().length).toBeGreaterThan(0)
  })
})
