import { defineStore } from 'pinia'
import { global, saveConfigState, getConfigChanges } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@mp-se/espframework-ui-components'

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
      global.disabled = true;
      try {
        logInfo('configStore.load()', 'Fetching /api/config');
        const response = await fetch(global.baseURL + 'api/config', {
          method: 'GET',
          headers: { Authorization: global.token },
          signal: AbortSignal.timeout(global.fetchTimeout)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const json = await response.json();
        logDebug('configStore.load()', json);
        Object.assign(this, json);
        logInfo('configStore.load()', 'Fetching /api/config completed');
        return true;
      } catch (err) {
        logError('configStore.load()', err);
        return false;
      } finally {
        global.disabled = false;
      }
    },
    // ...existing actions remain unchanged...
    // ...existing actions...
    async sendConfig() {
      global.disabled = true;
      try {
        logInfo('configStore.sendConfig()', 'Sending /api/config');
        const data = getConfigChanges();
        logDebug('configStore.sendConfig()', data);
        if (JSON.stringify(data).length == 2) {
          logInfo('configStore.sendConfig()', 'No config data to store, skipping step');
          return true;
        }
        const response = await fetch(global.baseURL + 'api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: global.token },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(global.fetchTimeout)
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        logInfo('configStore.sendConfig()', 'Sending /api/config completed');
        return true;
      } catch (err) {
        logError('configStore.sendConfig()', err);
        return false;
      } finally {
        global.disabled = false;
      }
    },
    async sendWifiScan() {
      global.disabled = true;
      try {
        logInfo('configStore.sendWifiScan()', 'Sending /api/wifi');
        const response = await fetch(global.baseURL + 'api/wifi', {
          headers: { Authorization: global.token },
          signal: AbortSignal.timeout(global.fetchTimeout)
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        logInfo('configStore.sendWifiScan()', 'Sending /api/wifi completed');
        return true;
      } catch (err) {
        logError('configStore.sendWifiScan()', err);
        return false;
      } finally {
        global.disabled = false;
      }
    },
    async getWifiScanStatus() {
      try {
        logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status');
        const response = await fetch(global.baseURL + 'api/wifi/status', {
          method: 'GET',
          headers: { Authorization: global.token },
          signal: AbortSignal.timeout(global.fetchTimeout)
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        logDebug('configStore.getWifiScanStatus()', json);
        logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status completed');
        return { success: true, data: json };
      } catch (err) {
        logError('configStore.getWifiScanStatus()', err);
        return { success: false, error: err };
      }
    },
    async sendSensorScan() {
      global.disabled = true;
      try {
        logInfo('configStore.sendSensorScan()', 'Sending /api/sensor');
        const response = await fetch(global.baseURL + 'api/sensor', {
          headers: { Authorization: global.token },
          signal: AbortSignal.timeout(global.fetchTimeout)
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        logInfo('configStore.sendSensorScan()', 'Sending /api/sensor completed');
        return true;
      } catch (err) {
        logError('configStore.sendSensorScan()', err);
        return false;
      } finally {
        global.disabled = false;
      }
    },
    async getSensorScanStatus() {
      try {
        logInfo('configStore.getSensorScanStatus()', 'Fetching /api/sensor/status');
        const response = await fetch(global.baseURL + 'api/sensor/status', {
          method: 'GET',
          headers: { Authorization: global.token },
          signal: AbortSignal.timeout(global.fetchTimeout)
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        logDebug('configStore.getSensorScanStatus()', json);
        logInfo('configStore.getSensorScanStatus()', 'Fetching /api/sensor/status completed');
        return { success: true, data: json };
      } catch (err) {
        logError('configStore.getSensorScanStatus()', err);
        return { success: false, error: err };
      }
    },
    // Async wrapper for sendConfig
    // sendConfigAsync removed, use sendConfig directly with await
    
    async saveAll() {
      try {
        global.clearMessages();
        global.disabled = true;
        const configSuccess = await this.sendConfig();
        if (!configSuccess) {
          global.messageError = 'Failed to store configuration to device';
          return false;
        }
        global.messageSuccess = 'Configuration has been saved to device';
        saveConfigState();
        return true;
      } catch (error) {
        logError('configStore.saveAll()', error);
        global.messageError = 'Failed to save configuration';
        return false;
      } finally {
        global.disabled = false;
      }
    },
    async sendFilesystemRequest(data) {
      global.disabled = true;
      try {
        logInfo('configStore.sendFilesystemRequest()', 'Sending /api/filesystem');
        const response = await fetch(global.baseURL + 'api/filesystem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: global.token },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(global.fetchTimeout)
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const text = await response.text();
        logDebug('configStore.sendFilesystemRequest()', text);
        return { success: true, data: text };
      } catch (err) {
        logError('configStore.sendFilesystemRequest()', err);
        return { success: false, error: err };
      } finally {
        global.disabled = false;
      }
    },
    async runWifiScan() {
      global.disabled = true;
      logInfo('configStore.runWifiScan()', 'Starting wifi scan');
      const success = await this.sendWifiScan();
      if (!success) {
        global.messageError = 'Failed to start wifi scan';
        global.disabled = false;
        return { success: false };
      }
      // Poll for scan completion
      let result;
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        result = await this.getWifiScanStatus();
        if (!result.success) {
          global.messageError = 'Failed to get wifi scan status';
          global.disabled = false;
          return { success: false };
        }
        if (!result.data.status) {
          // scan finished
          global.disabled = false;
          return result;
        }
        // scan still running, continue polling
      }
    },
    async runSensorScan() {
      global.disabled = true;
      logInfo('configStore.runSensorScan()', 'Starting sensor scan');
      const success = await this.sendSensorScan();
      if (!success) {
        global.messageError = 'Failed to start sensor scan';
        global.disabled = false;
        return { success: false };
      }
      // Poll for scan completion
      let result;
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        result = await this.getSensorScanStatus();
        if (!result.success) {
          global.messageError = 'Failed to get sensor scan status';
          global.disabled = false;
          return { success: false };
        }
        if (!result.data.status) {
          // scan finished
          global.disabled = false;
          return result;
        }
        // scan still running, continue polling
      }
    }
  }
})
