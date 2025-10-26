import { defineStore } from 'pinia'
import { logInfo, logDebug, logError } from '@mp-se/espframework-ui-components'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      id: '',
      platform: '',
      board: '',
      app_ver: '',
      app_build: '',
      firmware_file: '',

      initialized: false,
      disabled: false,
      configChanged: false,

      ui: {
        enableVoltageFragment: false,
        enableManualWifiEntry: false,
        enableScanForStrongestAp: false
      },

      feature: {
        ble: true
      },

      messageError: '',
      messageWarning: '',
      messageSuccess: '',
      messageInfo: ''
    }
  },
  getters: {
    isError() {
      return this.messageError != '' ? true : false
    },
    isWarning() {
      return this.messageWarning != '' ? true : false
    },
    isSuccess() {
      return this.messageSuccess != '' ? true : false
    },
    isInfo() {
      return this.messageInfo != '' ? true : false
    },
    uiVersion() {
      return import.meta.env.PACKAGE_VERSION || '0.0.0'
    },
    uiBuild() {
      return import.meta.env.VITE_BUILD_TIME || 'dev'
    }
  },
  actions: {
    clearMessages() {
      this.messageError = ''
      this.messageWarning = ''
      this.messageSuccess = ''
      this.messageInfo = ''
    },
    async load() {
      try {
        logInfo('globalStore.load()', 'Fetching /api/feature')
        const json = await http.getJson('api/feature')
        logDebug('globalStore.load()', json)

        this.board = json.board.toUpperCase()
        this.app_ver = json.app_ver
        this.app_build = json.app_build
        this.platform = json.platform.toUpperCase()
        this.firmware_file = json.firmware_file.toLowerCase()

        this.feature.ble = json.ble

        logInfo('globalStore.load()', 'Fetching /api/feature completed')
        return true
      } catch (err) {
        logError('globalStore.load()', err)
        return false
      }
    }
  }
})
