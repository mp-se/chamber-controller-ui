<template>
  <dialog id="spinner" class="loading">
    <div class="container text-center">
      <div class="row align-items-center" style="height: 170px">
        <div class="col">
          <div class="spinner-border" role="status" style="width: 5rem; height: 5rem">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </dialog>

  <div v-if="!global.initialized" class="container text-center">
    <BsMessage
      message="Initializing Chamber Controller Web interface"
      class="h2"
      :dismissable="false"
      alert="info"
    ></BsMessage>
  </div>

  <BsMenuBar 
    v-if="global.initialized" 
    :disabled="global.disabled" 
    brand="Chamber Controller"
     :menu-items="items"
     :dark-mode="config.dark_mode"
     :mdns="config.mdns"
     :config-changed="global.configChanged"
    @update:dark-mode="handleDarkModeUpdate"
  />

  <div class="container">
    <div>
      <p></p>
    </div>
    <BsMessage
      v-if="!status.connected"
      message="No response from device, has it gone into sleep mode? No need to refresh the page, just turn on the device again"
      class="h2"
      :dismissable="false"
      alert="danger"
    ></BsMessage>

    <BsMessage
      v-if="global.isError"
      :close="close"
      :dismissable="true"
      :message="global.messageError"
      alert="danger"
    />
    <BsMessage
      v-if="global.isWarning"
      :close="close"
      :dismissable="true"
      :message="global.messageWarning"
      alert="warning"
    />
    <BsMessage
      v-if="global.isSuccess"
      :close="close"
      :dismissable="true"
      :message="global.messageSuccess"
      alert="success"
    />
    <BsMessage
      v-if="global.isInfo"
      :close="close"
      :dismissable="true"
      :message="global.messageInfo"
      alert="info"
    />

    <BsMessage v-if="status.wifi_setup" :dismissable="false" alert="info">
      Running in WIFI setup mode. Go to the
      <router-link class="alert-link" to="/device/wifi">wifi settings</router-link> meny and select
      wifi. Restart device after settings are selected.
    </BsMessage>
  </div>

  <router-view v-if="global.initialized" />
  <BsFooter
    v-if="global.initialized"
    :text="
      '(c) 2024-2025 Magnus Persson, ui version ' + global.uiVersion + ' (' + global.uiBuild + ')'
    "
  />
</template>

<script setup>

import { watch, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { global, status, config, saveConfigState } from '@/modules/pinia'
// Removed unused logError, logDebug, logInfo imports
import { items as staticItems } from '@/modules/router'
import { computed } from 'vue'

const items = computed(() => JSON.parse(JSON.stringify(staticItems.value)))

const polling = ref(null)
const close = (alert) => {
  if (alert == 'danger') global.messageError = ''
  else if (alert == 'warning') global.messageWarning = ''
  else if (alert == 'success') global.messageSuccess = ''
  else if (alert == 'info') global.messageInfo = ''
}

watch(() => global.disabled, () => {
  if (global.disabled) document.body.style.cursor = 'wait'
  else document.body.style.cursor = 'default'
})

function ping() {
  status.ping()
}

function showSpinner() {
  const spinner = document.querySelector('#spinner')
  if (spinner) spinner.showModal()
}

function hideSpinner() {
  const spinner = document.querySelector('#spinner')
  if (spinner) spinner.close()
}

async function initializeApp() {
  try {
    showSpinner()
    // Step 1: Authenticate with device
    const authResult = await status.auth()
    if (!authResult.success || !authResult.data || !authResult.data.token) {
      global.messageError = 'Failed to authenticate with device, please try to reload page!'
      hideSpinner()
      return
    }
    global.id = authResult.data.token

    // Step 2: Load device status
    const statusSuccess = await status.load()
    if (!statusSuccess) {
      global.messageError = 'Failed to load status from device, please try to reload page!'
      hideSpinner()
      return
    }
    global.platform = status.platform

    // Step 3: Load configuration
    const configSuccess = await config.load()
    if (!configSuccess) {
      global.messageError = 'Failed to load configuration data from device, please try to reload page!'
      hideSpinner()
      return
    }

    // Save config snapshot for change detection
    saveConfigState()

    // Success! Initialize the app
    global.initialized = true
    hideSpinner()
  } catch (error) {
    global.messageError = `Initialization failed: ${error.message}`
    hideSpinner()
  }
}

// Handle dark mode changes
const handleDarkModeUpdate = (newValue) => {
  // update the store value
  config.dark_mode = newValue
  // fallback: ensure the attribute is set on the document root so Bootstrap theme rules apply
  try {
    const root = document.documentElement
    if (newValue) root.setAttribute('data-bs-theme', 'dark')
    else root.setAttribute('data-bs-theme', 'light')
  } catch (e) {
    console.error('Failed to set data-bs-theme on documentElement', e)
  }
}

onBeforeMount(() => {
  initializeApp()
  polling.value = setInterval(ping, 7000)
})

onBeforeUnmount(() => {
  if (polling.value) {
    clearInterval(polling.value)
  }
})
</script>

<style>
.loading {
  position: fixed;
  width: 200px;
  height: 200px;
  padding: 10px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 0;
}

dialog::backdrop {
  background-color: black;
  opacity: 60%;
}
</style>
