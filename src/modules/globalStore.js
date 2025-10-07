import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      id: '',
      platform: '',

      initialized: false,
      disabled: false,
      configChanged: false,

      ui: {
        enableVoltageFragment: false,
        enableManualWifiEntry: false,
        enableScanForStrongestAp: false, 
      },

      feature: {
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
    }
  }
})
