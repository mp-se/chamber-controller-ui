import { defineStore } from 'pinia'
import { global, saveConfigState, getConfigChanges } from '@/modules/pinia'
import {
  logDebug,
  logError,
  logInfo,
  sharedHttpClient as http
} from '@mp-se/espframework-ui-components'

export const useConfigStore = defineStore('config', {
  state: () => ({
    id: '',
    mdns: '',
    temp_format: '',
    ota_url: '',
    restart_interval: 0,
    wifi_portal_timeout: 0,
    wifi_connect_timeout: 0,
    wifi_ssid: '',
    wifi_ssid2: '',
    wifi_pass: '',
    wifi_pass2: '',
    push_timeout: 0,
    http_post_target: '',
    http_post_header1: '',
    http_post_header2: '',
    http_post2_target: '',
    http_post2_header1: '',
    http_post2_header2: '',
    http_get_target: '',
    http_get_header1: '',
    http_get_header2: '',
    influxdb2_target: '',
    influxdb2_bucket: '',
    influxdb2_org: '',
    influxdb2_token: '',
    mqtt_target: '',
    mqtt_port: 0,
    mqtt_user: '',
    mqtt_pass: '',
    dark_mode: false,
    fridge_sensor_id: '',
    beer_sensor_id: '',
    fridge_sensor_offset: 0,
    beer_sensor_offset: 0,
    controller_mode: 'o',
    target_temperature: 0,
    enable_cooling: false,
    enable_heating: false,
    invert_pins: false,
    ble_enabled: false
    // Add any additional config fields from pressuremon-ui if needed
  }),
  actions: {
    async load() {
      global.disabled = true
      try {
        logInfo('configStore.load()', 'Fetching /api/config')
        const json = await http.getJson('api/config')
        logDebug('configStore.load()', json)
        Object.assign(this, json)
        logInfo('configStore.load()', 'Fetching /api/config completed')
        return true
      } catch (err) {
        logError('configStore.load()', err)
        return false
      } finally {
        global.disabled = false
      }
    },
    async sendConfig() {
      global.disabled = true
      logInfo('configStore.sendConfig()', 'Sending /api/config')

      const data = getConfigChanges()
      logDebug('configStore.sendConfig()', data)

      if (JSON.stringify(data).length == 2) {
        logInfo('configStore.sendConfig()', 'No config data to store, skipping step')
        global.disabled = false
        this.convertTemp()
        return true
      }

      try {
        await http.postJson('api/config', data)
        global.disabled = false
        logInfo('configStore.sendConfig()', 'Sending /api/config completed')
        return true
      } catch (err) {
        logError('configStore.sendConfig()', err)
        global.disabled = false
        return false
      }
    },
    async restart() {
      global.clearMessages()
      global.disabled = true
      try {
        const res = await http.restart(this.mdns, { redirectDelayMs: 8000 })
        if (res.success && res.json && res.json.status === true) {
          global.messageSuccess =
            (res.json.message || '') +
            ' Redirecting to http://' +
            this.mdns +
            '.local in 8 seconds.'
          logInfo('configStore.restart()', 'Restart requested, redirect scheduled')
        } else if (res.success && res.json) {
          global.messageError = res.json.message || 'Failed to restart device'
        } else {
          global.messageError = 'Failed to request restart'
        }
      } catch (err) {
        logError('configStore.restart()', err)
        global.messageError = 'Failed to do restart'
      } finally {
        global.disabled = false
      }
    },
    async sendWifiScan() {
      global.disabled = true
      logInfo('configStore.sendWifiScan()', 'Sending /api/wifi')
      try {
        await http.request('api/wifi')
        logInfo('configStore.sendWifiScan()', 'Sending /api/wifi completed')
        return true
      } catch (err) {
        logError('configStore.sendWifiScan()', err)
        return false
      }
    },
    async sendSensorScan() {
      global.disabled = true
      logInfo('configStore.sendSensorScan()', 'Sending /api/sensor')
      try {
        await http.request('api/sensor')
        logInfo('configStore.sendSensorScan()', 'Sending /api/sensor completed')
        return true
      } catch (err) {
        logError('configStore.sendSensorScan()', err)
        return false
      }
    },
    async getWifiScanStatus() {
      logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status')
      try {
        const json = await http.getJson('api/wifi/status')
        logDebug('configStore.getWifiScanStatus()', json)
        logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status completed')
        return { success: true, data: json }
      } catch (err) {
        logError('configStore.getWifiScanStatus()', err)
        return { success: false, data: null }
      }
    },
    async getSensorScanStatus() {
      logInfo('configStore.getSensorScanStatus()', 'Fetching /api/sensor/status')
      try {
        const json = await http.getJson('api/sensor/status')
        logDebug('configStore.getSensorScanStatus()', json)
        logInfo('configStore.getSensorScanStatus()', 'Fetching /api/sensor/status completed')
        return { success: true, data: json }
      } catch (err) {
        logError('configStore.getSensorScanStatus()', err)
        return { success: false, data: null }
      }
    },

    async saveAll() {
      global.clearMessages()
      global.disabled = true

      try {
        const configSuccess = await this.sendConfig()
        if (!configSuccess) {
          global.messageError = 'Failed to store configuration to device'
          return
        }

        global.messageSuccess = 'Configuration has been saved to device'
        saveConfigState()
      } catch (error) {
        logError('configStore.saveAll()', error)
        global.messageError = 'Failed to save configuration'
      } finally {
        global.disabled = false
      }
    },
    async runWifiScan() {
      global.disabled = true
      logInfo('configStore.runWifiScan()', 'Starting wifi scan')

      try {
        const started = await this.sendWifiScan()
        if (!started) {
          global.messageError = 'Failed to start wifi scan'
          return { success: false }
        }

        while (true) {
          const statusRes = await this.getWifiScanStatus()
          if (!statusRes.success) {
            global.messageError = 'Failed to get wifi scan status'
            return { success: false }
          }

          if (statusRes.data.status) {
            await new Promise((r) => setTimeout(r, 2000))
            continue
          }

          global.disabled = false
          return { success: statusRes.data.success, data: statusRes.data }
        }
      } finally {
        global.disabled = false
      }
    },
    async runSensorScan() {
      global.disabled = true
      logInfo('configStore.runSensorScan()', 'Starting sensor scan')

      try {
        const started = await this.sendSensorScan()
        if (!started) {
          return { success: false }
        }

        while (true) {
          const statusRes = await this.getSensorScanStatus()
          if (!statusRes.success) {
            return { success: false }
          }

          if (statusRes.data.status) {
            await new Promise((r) => setTimeout(r, 2000))
            continue
          }

          global.disabled = false
          return { success: statusRes.data.success, data: statusRes.data }
        }
      } finally {
        global.disabled = false
      }
    }
  }
})
