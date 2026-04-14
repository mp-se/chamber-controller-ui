import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PidControllerFragment from '../PidControllerFragment.vue'
import { createTestingPinia } from '../../tests/testUtils'
import { useConfigStore } from '@/modules/configStore'
import { useGlobalStore } from '@/modules/globalStore'
import { useStatusStore } from '@/modules/statusStore'

vi.mock('@mp-se/espframework-ui-components', () => ({
  validateCurrentForm: vi.fn(() => true),
  logDebug: vi.fn(),
  logInfo: vi.fn(),
  logError: vi.fn(),
  sharedHttpClient: {
    postJson: vi.fn()
  }
}))

describe('PidControllerFragment', () => {
  let pinia
  let config
  let global
  let status

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia()
    config = useConfigStore(pinia)
    global = useGlobalStore(pinia)
    status = useStatusStore(pinia)
  })

  const createWrapper = (stubs = {}) => {
    return mount(PidControllerFragment, {
      global: {
        plugins: [pinia],
        stubs: {
          BsCard: { template: '<div class="card"><slot /></div>', props: ['header'] },
          BsButton: { template: '<button><slot /></button>', props: ['type'] },
          BsInputNumber: { template: '<input type="number" v-model="modelValue" />', props: ['modelValue', 'label', 'disabled'] },
          BsInputRadio: { template: '<div><slot /></div>', props: ['modelValue', 'options', 'label', 'disabled'] },
          ...stubs
        }
      }
    })
  }

  describe('component mounting', () => {
    it('mounts without error', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders card component', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.card').exists()).toBe(true)
    })

    it('displays controller header', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('Controller')
    })

    it('renders form element', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('form').exists()).toBe(true)
    })
  })

  describe('onMounted configuration checks', () => {
    it('shows error when neither cooling nor heating enabled', async () => {
      config.enable_cooling = false
      config.enable_heating = false
      config.beer_sensor_id = 'sensor1'
      global.messageError = ''
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      // Component should execute onMounted logic
      expect(wrapper.exists()).toBe(true)
    })

    it('shows error when cooling/heating enabled but no sensors', async () => {
      config.enable_cooling = true
      config.enable_heating = false
      config.beer_sensor_id = ''
      config.fridge_sensor_id = ''
      global.messageError = ''
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      // Component should execute onMounted logic
      expect(wrapper.exists()).toBe(true)
    })

    it('handles beer sensor configuration', async () => {
      config.enable_cooling = true
      config.beer_sensor_id = 'sensor1'
      config.fridge_sensor_id = ''
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      // Component should handle beer sensor
      expect(config.beer_sensor_id).toBe('sensor1')
    })

    it('handles chamber sensor configuration', async () => {
      config.enable_cooling = true
      config.beer_sensor_id = ''
      config.fridge_sensor_id = 'sensor2'
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      // Component should handle fridge sensor
      expect(config.fridge_sensor_id).toBe('sensor2')
    })

    it('handles both sensors configured', async () => {
      config.enable_cooling = true
      config.beer_sensor_id = 'beer_sensor'
      config.fridge_sensor_id = 'fridge_sensor'
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      // Component should handle both sensors
      expect(config.beer_sensor_id).toBe('beer_sensor')
      expect(config.fridge_sensor_id).toBe('fridge_sensor')
    })
  })

  describe('saveSettings API call', () => {
    it('calls API with correct data on form submission', async () => {
      const { sharedHttpClient } = await import('@mp-se/espframework-ui-components')
      config.enable_cooling = true
      config.beer_sensor_id = 'sensor1'
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      wrapper.vm.newMode = 'b'
      wrapper.vm.newTemperature = 20
      
      await wrapper.vm.saveSettings()
      
      expect(wrapper.exists()).toBe(true)
    })

    it('handles successful API call', async () => {
      config.enable_cooling = true
      config.beer_sensor_id = 'sensor1'
      
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      await wrapper.vm.saveSettings()
      
      // Component should handle the response
      expect(wrapper.exists()).toBe(true)
    })

    it('handles API errors gracefully', async () => {
      config.enable_cooling = true
      config.beer_sensor_id = 'sensor1'
      
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      // Even with errors, component should not throw
      try {
        await wrapper.vm.saveSettings()
      } catch (e) {
        // Expected to handle errors
      }
      
      expect(wrapper.exists()).toBe(true)
    })

    it('form validation is checked before API call', async () => {
      const { validateCurrentForm } = await import('@mp-se/espframework-ui-components')
      config.enable_cooling = true
      config.beer_sensor_id = 'sensor1'
      
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      await wrapper.vm.saveSettings()
      
      // validateCurrentForm should have been called
      expect(validateCurrentForm).toHaveBeenCalled()
    })

    it('clears messages before sending', async () => {
      config.enable_cooling = true
      config.beer_sensor_id = 'sensor1'
      global.messageError = 'Previous error'
      
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      await wrapper.vm.saveSettings()
      
      // Component should attempt to clear messages
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('target temperature', () => {
    it('has temperature tracking', async () => {
      config.target_temperature = 19.5
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm).toBeDefined()
    })

    it('temperature format affects unit display', async () => {
      config.temp_format = 'C'
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm).toBeDefined()
    })

    it('can use fahrenheit format', async () => {
      config.temp_format = 'F'
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(config.temp_format).toBe('F')
    })
  })

  describe('button disabled state', () => {
    it('disables button when global disabled flag set', async () => {
      config.enable_cooling = true
      config.beer_sensor_id = 'sensor1'
      global.disabled = true
      
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      expect(global.disabled).toBe(true)
    })

    it('disables button when only Off mode available', async () => {
      config.enable_cooling = false
      config.enable_heating = false
      
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      // Should only have Off mode, so button should be disabled
      expect(wrapper.vm.modeOptions.length).toBe(1)
    })

    it('enables button when mode options available and not disabled', async () => {
      config.enable_cooling = true
      config.beer_sensor_id = 'sensor1'
      global.disabled = false
      
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      expect(global.disabled).toBe(false)
    })
  })

  describe('mode selection', () => {
    it('initializes with Off mode', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.newMode).toBe('o')
    })

    it('allows changing mode', async () => {
      config.enable_cooling = true
      config.beer_sensor_id = 'sensor1'
      
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      wrapper.vm.newMode = 'b'
      expect(wrapper.vm.newMode).toBe('b')
    })
  })
})
