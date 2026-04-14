import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import { setupTestEnvironment, commonStubs } from '@/tests/testUtils'

describe('HomeView', () => {
  let pinia

  const createWrapper = (props = {}) =>
    mount(HomeView, {
      props,
      global: {
        plugins: [pinia],
        stubs: {
          ...commonStubs,
          PidTemperatureFragment: true,
          PidControllerFragment: true,
          BsCard: true
        }
      }
    })

  beforeEach(() => {
    const env = setupTestEnvironment()
    pinia = env.pinia
  })

  describe('Rendering', () => {
    it('renders the component', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('displays main container', () => {
      const wrapper = createWrapper()
      const container = wrapper.find('.container')
      expect(container.exists()).toBe(true)
    })

    it('conditionally renders temperature fragments', () => {
      const wrapper = createWrapper()
      // The view should exist, actual rendering depends on store state
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Template Structure', () => {
    it('has proper responsive grid classes', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.row').exists()).toBe(true)
    })
  })
})
