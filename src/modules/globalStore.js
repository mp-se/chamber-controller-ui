import { defineStore } from 'pinia'
import { logInfo } from '@mp-se/espframework-ui-components'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      id: '',
      platform: '',

      initialized: false,
      disabled: false,
      configChanged: false,

      messageError: '',
      messageWarning: '',
      messageSuccess: '',
      messageInfo: '',

      fetchTimeout: 8000,
      url: undefined
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
    token() {
      return 'Bearer ' + this.id
    },
    baseURL() {
      if (this.url !== undefined) return this.url

      if (import.meta.env.VITE_APP_HOST === undefined) {
        logInfo(
          'globalStore.baseURL()',
          'Using base URL from window location',
          window.location.href
        )
        this.url = window.location.href
      } else {
        logInfo('globalStore.baseURL()', 'Using base URL from env', import.meta.env.VITE_APP_HOST)
        this.url = import.meta.env.VITE_APP_HOST
      }

      return this.url
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
