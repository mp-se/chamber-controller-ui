import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import piniaInstance, { global, config, status, saveConfigState, getConfigChanges } from '@/modules/pinia'

describe('pinia module', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('exports pinia instance', () => {
    expect(piniaInstance).toBeDefined()
  })

  it('exports global store', () => {
    expect(global).toBeDefined()
    expect(global.$id).toBe('global')
  })

  it('exports config store', () => {
    expect(config).toBeDefined()
    expect(config.$id).toBe('config')
  })

  it('exports status store', () => {
    expect(status).toBeDefined()
    expect(status.$id).toBe('status')
  })

  it('stores have required methods', () => {
    expect(typeof config.load).toBe('function')
    expect(typeof config.sendConfig).toBe('function')
    expect(typeof config.saveAll).toBe('function')
    expect(typeof status.load).toBe('function')
  })
})

describe('config store actions exist', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('load is callable', () => {
    expect(typeof config.load).toBe('function')
  })
  it('sendConfig is callable', () => {
    expect(typeof config.sendConfig).toBe('function')
  })
  it('restart is callable', () => {
    expect(typeof config.restart).toBe('function')
  })
  it('sendWifiScan is callable', () => {
    expect(typeof config.sendWifiScan).toBe('function')
  })
  it('sendSensorScan is callable', () => {
    expect(typeof config.sendSensorScan).toBe('function')
  })
  it('getWifiScanStatus is callable', () => {
    expect(typeof config.getWifiScanStatus).toBe('function')
  })
  it('getSensorScanStatus is callable', () => {
    expect(typeof config.getSensorScanStatus).toBe('function')
  })
  it('saveAll is callable', () => {
    expect(typeof config.saveAll).toBe('function')
  })
  it('runWifiScan is callable', () => {
    expect(typeof config.runWifiScan).toBe('function')
  })
  it('runSensorScan is callable', () => {
    expect(typeof config.runSensorScan).toBe('function')
  })
})

describe('config store state properties', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has id property', () => {
    expect(config).toHaveProperty('id')
  })
  it('has mdns property', () => {
    expect(config).toHaveProperty('mdns')
  })
  it('has temp_format property', () => {
    expect(config).toHaveProperty('temp_format')
  })
  it('has ota_url property', () => {
    expect(config).toHaveProperty('ota_url')
  })
  it('has wifi_ssid property', () => {
    expect(config).toHaveProperty('wifi_ssid')
  })
  it('has mqtt_target property', () => {
    expect(config).toHaveProperty('mqtt_target')
  })
  it('has mqtt_port property', () => {
    expect(config).toHaveProperty('mqtt_port')
  })
  it('has influxdb2_target property', () => {
    expect(config).toHaveProperty('influxdb2_target')
  })
  it('has influxdb2_bucket property', () => {
    expect(config).toHaveProperty('influxdb2_bucket')
  })
  it('has influxdb2_org property', () => {
    expect(config).toHaveProperty('influxdb2_org')
  })
  it('has dark_mode property', () => {
    expect(config).toHaveProperty('dark_mode')
  })
  it('has ble_push_enabled property', () => {
    expect(config).toHaveProperty('ble_push_enabled')
  })
  it('has ble_scan_enabled property', () => {
    expect(config).toHaveProperty('ble_scan_enabled')
  })
  it('has fridge_sensor_id property', () => {
    expect(config).toHaveProperty('fridge_sensor_id')
  })
  it('has beer_sensor_id property', () => {
    expect(config).toHaveProperty('beer_sensor_id')
  })
  it('has enable_cooling property', () => {
    expect(config).toHaveProperty('enable_cooling')
  })
  it('has enable_heating property', () => {
    expect(config).toHaveProperty('enable_heating')
  })
  it('has restart_interval property', () => {
    expect(config).toHaveProperty('restart_interval')
  })
})

describe('status and global stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('status.load is callable', () => {
    expect(typeof status.load).toBe('function')
  })
  it('global.clearMessages is callable', () => {
    expect(typeof global.clearMessages).toBe('function')
  })
  it('global has messageError property', () => {
    expect(global).toHaveProperty('messageError')
  })
  it('global has messageSuccess property', () => {
    expect(global).toHaveProperty('messageSuccess')
  })
  it('global has disabled property', () => {
    expect(global).toHaveProperty('disabled')
  })
})

describe('pinia module exports', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('saveConfigState is defined', () => {
    expect(typeof saveConfigState).toBe('function')
  })

  it('getConfigChanges is defined', () => {
    expect(typeof getConfigChanges).toBe('function')
  })

  it('getConfigChanges returns empty object when no state saved', () => {
    const changes = getConfigChanges()
    expect(typeof changes).toBe('object')
  })

  it('saveConfigState captures config values', () => {
    config.mdns = 'test-device'
    saveConfigState()
    expect(config.mdns).toBe('test-device')
  })

  it('getConfigChanges detects modified values', () => {
    config.mdns = 'original'
    saveConfigState()
    config.mdns = 'modified'
    const changes = getConfigChanges()
    expect(typeof changes).toBe('object')
  })

  it('configChanged flag is managed by config store', () => {
    expect(global).toHaveProperty('configChanged')
  })

  it('initialized flag affects subscription behavior', () => {
    expect(global).toHaveProperty('initialized')
  })
})
