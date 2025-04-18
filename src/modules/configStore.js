import { defineStore } from 'pinia'
import { global, saveConfigState, getConfigChanges } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
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
    }
  },
  actions: {
    load(callback) {
      global.disabled = true
      fetch(global.baseURL + 'api/config', {
        method: 'GET',
        headers: { Authorization: global.token }
      })
        .then((res) => res.json())
        .then((json) => {
          global.disabled = false
          this.id = json.id
          this.mdns = json.mdns
          this.temp_format = json.temp_format
          this.ota_url = json.ota_url
          this.restart_interval = json.restart_interval
          this.wifi_portal_timeout = json.wifi_portal_timeout
          this.wifi_connect_timeout = json.wifi_connect_timeout
          this.wifi_ssid = json.wifi_ssid
          this.wifi_ssid2 = json.wifi_ssid2
          this.wifi_pass = json.wifi_pass
          this.wifi_pass2 = json.wifi_pass2
          this.push_timeout = json.push_timeout
          this.http_post_target = json.http_post_target
          this.http_post_header1 = json.http_post_header1
          this.http_post_header2 = json.http_post_header2
          this.http_post2_target = json.http_post2_target
          this.http_post2_header1 = json.http_post2_header1
          this.http_post2_header2 = json.http_post2_header2
          this.http_get_target = json.http_get_target
          this.http_get_header1 = json.http_get_header1
          this.http_get_header2 = json.http_get_header1
          this.influxdb2_target = json.influxdb2_target
          this.influxdb2_bucket = json.influxdb2_bucket
          this.influxdb2_org = json.influxdb2_org
          this.influxdb2_token = json.influxdb2_token
          this.mqtt_target = json.mqtt_target
          this.mqtt_port = json.mqtt_port
          this.mqtt_user = json.mqtt_user
          this.mqtt_pass = json.mqtt_pass
          this.dark_mode = json.dark_mode

          this.fridge_sensor_id = json.fridge_sensor_id
          this.beer_sensor_id = json.beer_sensor_id
          this.fridge_sensor_offset = json.fridge_sensor_offset
          this.beer_sensor_offset = json.beer_sensor_offset
          this.controller_mode = json.controller_mode
          this.target_temperature = json.target_temperature
          this.enable_cooling = json.enable_cooling
          this.enable_heating = json.enable_heating
          this.invert_pins = json.invert_pins
          this.ble_enabled = json.ble_enabled
          callback(true)
        })
        .catch((err) => {
          global.disabled = false
          logDebug('configStore:load()', err)
          callback(false)
        })
    },
    sendConfig(callback) {
      global.disabled = true
      logDebug('configStore:sendConfig()', 'Sending /api/config')

      var data = getConfigChanges()
      logDebug('configStore:sendConfig()', data)

      if (JSON.stringify(data).length == 2) {
        logInfo('configStore:sendConfig()', 'No config data to store, skipping step')
        global.disabled = false
        callback(true)
        return
      }

      fetch(global.baseURL + 'api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: global.token },
        body: JSON.stringify(data)
      })
        .then((res) => {
          global.disabled = false
          if (res.status != 200) {
            logError('configStore:sendConfig()', 'Sending /api/config failed', res.status)
            callback(false)
          } else {
            logInfo('configStore:sendConfig()', 'Sending /api/config completed')
            callback(true)
          }
        })
        .catch((err) => {
          logError('configStore:sendConfig()', 'Sending /api/config failed', err)
          callback(false)
          global.disabled = false
        })
    },
    sendWifiScan(callback) {
      global.disabled = true
      logDebug('configStore:sendWifiScan()', 'Sending /api/wifi')
      fetch(global.baseURL + 'api/wifi', {
        headers: { Authorization: global.token }
      })
        .then((res) => {
          if (res.status != 200) {
            logError('configStore:sendWifiScan()', 'Sending /api/wifi failed')
            callback(false)
          } else {
            logInfo('configStore:sendWifiScan()', 'Sending /api/wifi completed')
            callback(true)
          }
        })
        .catch((err) => {
          logError('configStore:sendWifiScan()', 'Sending /api/wifi failed', err)
          callback(false)
        })
    },
    getWifiScanStatus(callback) {
      logDebug('configStore:sendWifiScanStatus()', 'Fetching /api/wifi/status')
      fetch(global.baseURL + 'api/wifi/status', {
        method: 'GET',
        headers: { Authorization: global.token }
      })
        .then((res) => res.json())
        .then((json) => {
          logDebug('configStore:sendWifiScanStatus()', json)
          logInfo('configStore:sendWifiScanStatus()', 'Fetching /api/wifi/status completed')
          callback(true, json)
        })
        .catch((err) => {
          logError('configStore:sendWifiScanStatus()', 'Fetching /api/wifi/status failed', err)
          callback(false, null)
        })
    },
    sendSensorScan(callback) {
      global.disabled = true
      logDebug('configStore:sendSensorScan()', 'Sending /api/sensor')
      fetch(global.baseURL + 'api/sensor', {
        headers: { Authorization: global.token }
      })
        .then((res) => {
          if (res.status != 200) {
            logError('configStore:sendSensorScan()', 'Sending /api/sensor failed')
            callback(false)
          } else {
            logInfo('configStore:sendSensorScan()', 'Sending /api/sensor completed')
            callback(true)
          }
        })
        .catch((err) => {
          logError('configStore:sendSensorScan()', 'Sending /api/sensor failed', err)
          callback(false)
        })
    },
    getSensorScanStatus(callback) {
      logDebug('configStore:getSensorScanStatus()', 'Fetching /api/sensor/status')
      fetch(global.baseURL + 'api/sensor/status', {
        method: 'GET',
        headers: { Authorization: global.token }
      })
        .then((res) => res.json())
        .then((json) => {
          logDebug('configStore:getSensorScanStatus()', json)
          logInfo('configStore:getSensorScanStatus()', 'Fetching /api/sensor/status completed')
          callback(true, json)
        })
        .catch((err) => {
          logError('configStore:getSensorScanStatus()', 'Fetching /api/sensor/status failed', err)
          callback(false, null)
        })
    },
    saveAll() {
      global.clearMessages()
      global.disabled = true
      this.sendConfig((success) => {
        if (!success) {
          global.disabled = false
          global.messageError = 'Failed to store configuration to device'
        } else {
          global.messageSuccess = 'Configuration has been saved to device'
          saveConfigState()
        }
      })
    },
    sendFilesystemRequest(data, callback) {
      global.disabled = true
      logDebug('configStore:sendFilesystemRequest()', 'Sending /api/filesystem')
      fetch(global.baseURL + 'api/filesystem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: global.token },
        body: JSON.stringify(data)
      })
        .then((res) => res.text())
        .then((text) => {
          logDebug('configStore:sendFilesystemRequest()', text)
          callback(true, text)
        })
        .catch((err) => {
          logError('configStore:sendFilesystemRequest()', 'Sending /api/filesystem failed', err)
          callback(false)
        })
    },
    runWifiScan(callback) {
      global.disabled = true
      this.sendWifiScan((success) => {
        if (success) {
          var check = setInterval(() => {
            this.getWifiScanStatus((success, data) => {
              if (success) {
                if (data.status) {
                  // test is still running, just wait for next check
                } else {
                  global.disabled = false
                  callback(data.success, data)
                  clearInterval(check)
                }
              } else {
                global.disabled = false
                global.messageError = 'Failed to get wifi scan status'
                callback(false)
                clearInterval(check)
              }
            })
          }, 2000)
        } else {
          global.disabled = false
          global.messageError = 'Failed to start wifi scan'
          callback(false)
        }
      })
    },
    runSensorScan(callback) {
      global.disabled = true
      this.sendSensorScan((success) => {
        if (success) {
          var check = setInterval(() => {
            this.getSensorScanStatus((success, data) => {
              if (success) {
                if (data.status) {
                  // test is still running, just wait for next check
                } else {
                  global.disabled = false
                  callback(data.success, data)
                  clearInterval(check)
                }
              } else {
                global.disabled = false
                global.messageError = 'Failed to get sensor scan status'
                callback(false)
                clearInterval(check)
              }
            })
          }, 2000)
        } else {
          global.disabled = false
          global.messageError = 'Failed to start sensor scan'
          callback(false)
        }
      })
    }
  }
})
