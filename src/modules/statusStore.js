import { defineStore } from 'pinia'
import { global } from '@/modules/pinia'
import { logDebug, logInfo, logError } from '@mp-se/espframework-ui-components'

// Declare managedFetch at module level, outside Pinia store

export const useStatusStore = defineStore('status', {
  state: () => {
    return {
      id: '',
      rssi: 0,
      app_ver: '',
      app_build: '',
      mdns: '',
      platform: '',
      wifi_ssid: '',
      ip: '',
      total_heap: 0,
      free_heap: 0,
      wifi_setup: false,

      uptime_seconds: 0,
      uptime_minutes: 0,
      uptime_hours: 0,
      uptime_days: 0,

      pid_mode: '',
      pid_state: 0,
      pid_state_string: '',
      pid_beer_temp: 0,
      pid_beer_temp_connected: false,
      pid_fridge_temp: 0,
      pid_fridge_temp_connected: false,
      pid_beer_target_temp: 0,
      pid_fridge_target_temp: 0,
      pid_temp_format: '',
      pid_cooling_actuator_active: false,
      pid_heating_actuator_active: false,
      pid_wait_time: 0,
      pid_time_since_cooling: 0,
      pid_time_since_heating: 0,
      pid_time_since_idle: 0,
      
      connected: true
    }
  },
  getters: {},
  actions: {
    async load() {
      try {
        logDebug('statusStore:load()', 'Fetching /api/status');
        const response = await fetch(global.baseURL + 'api/status', {
          signal: AbortSignal.timeout(global.fetchTimeout)
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        logDebug('statusStore:load()', json);
        this.id = json.id;
        this.rssi = json.rssi;
        this.app_ver = json.app_ver;
        this.app_build = json.app_build;
        this.mdns = json.mdns;
        this.platform = json.platform;
        this.wifi_ssid = json.wifi_ssid;
        this.ip = json.ip;
        this.total_heap = Math.round(json.total_heap / 1024).toFixed(0);
        this.free_heap = Math.round(json.free_heap / 1024).toFixed(0);
        this.wifi_setup = json.wifi_setup;
        this.uptime_seconds = json.uptime_seconds;
        this.uptime_minutes = json.uptime_minutes;
        this.uptime_hours = json.uptime_hours;
        this.uptime_days = json.uptime_days;
        this.pid_mode = json.pid_mode;
        this.pid_state = json.pid_state;
        this.pid_state_string = json.pid_state_string;
        this.pid_beer_temp = json.pid_beer_temp;
        this.pid_beer_temp_connected = json.pid_beer_temp_connected;
        this.pid_fridge_temp = json.pid_fridge_temp;
        this.pid_fridge_temp_connected = json.pid_fridge_temp_connected;
        this.pid_beer_target_temp = json.pid_beer_target_temp;
        this.pid_fridge_target_temp = json.pid_fridge_target_temp;
        this.pid_temp_format = json.pid_temp_format;
        this.pid_cooling_actuator_active = json.pid_cooling_actuator_active;
        this.pid_heating_actuator_active = json.pid_heating_actuator_active;
        this.pid_wait_time = json.pid_wait_time;
        this.pid_time_since_cooling = json.pid_time_since_cooling;
        this.pid_time_since_heating = json.pid_time_since_heating;
        this.pid_time_since_idle = json.pid_time_since_idle;
        logInfo('statusStore:load()', 'Fetching /api/status completed');
        return true;
      } catch (err) {
        logError('statusStore:load()', 'Fetching /api/status failed', err);
        return false;
      }
    },

    async auth() {
      try {
        logDebug('statusStore:auth()', 'Fetching /api/auth');
        var base = btoa('espfwk:password');
        const response = await fetch(global.baseURL + 'api/auth', {
          method: 'GET',
          headers: { Authorization: 'Basic ' + base },
          signal: AbortSignal.timeout(global.fetchTimeout)
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        logInfo('statusStore:auth()', 'Fetching /api/auth completed');
        return { success: true, data: json };
      } catch (err) {
        logError('statusStore:auth()', 'Fetching /api/auth failed', err);
        return { success: false, error: err };
      }
    },

    async ping() {
      try {
        // logInfo("statusStore.ping()", "Fetching /api/ping")
        const response = await fetch(global.baseURL + 'api/ping', {
          method: 'GET',
          signal: AbortSignal.timeout(global.fetchTimeout)
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        await response.json()
        // logInfo("statusStore.ping()", "Fetching /api/ping completed")
        this.connected = true
        return true
      } catch (err) {
        logError('statusStore.ping()', err)
        this.connected = false
        return false
      }
    }
  }
})
