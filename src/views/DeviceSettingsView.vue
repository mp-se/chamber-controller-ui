<template>
  <div class="container">
    <p></p>
    <p class="h2">Device - Settings</p>
    <hr />

    <BsMessage v-if="config.mdns === ''" dismissable="true" message="" alert="warning">
      You need to define a mdns name for the device
    </BsMessage>

    <form @submit.prevent="saveSettings" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-12">
          <BsInputText
            v-model="config.mdns"
            maxlength="63"
            minlength="1"
            label="MDNS"
            help="Enter device name used on the network, the suffix .local will be added to this name"
            :badge="badge.deviceMdnsBadge()"
            :disabled="global.disabled"
          >
          </BsInputText>
        </div>

        <div class="col-md-12">
          <hr />
        </div>

        <div class="col-md-3">
          <BsInputRadio
            v-model="config.temp_format"
            :options="tempOptions"
            label="Temperature Format"
            width=""
            :disabled="global.disabled"
          ></BsInputRadio>
        </div>

        <div class="col-md-3">
          <BsInputRadio
            v-model="config.dark_mode"
            :options="uiOptions"
            label="User Interface"
            width=""
            :disabled="global.disabled"
          ></BsInputRadio>
        </div>

        <!-- 
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.restart_interval"
            unit="minutes"
            label="Restart interval in minutes"
            min="30"
            max="1440"
            step="1"
            width="5"
            help="Interval when the device will restart to ensure stability (30-1440)"
            :disabled="global.disabled"
          ></BsInputNumber>
        </div>-->

        <div class="col-md-4">
          <BsSelect
            v-model="config.restart_interval"
            label="Restart interval"
            help="Interval when the device will restart to ensure stability"
            :options="restartOptions"
            :disabled="global.disabled"
          />
        </div>

      </div>

      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-12">
          <button
            type="submit"
            class="btn btn-primary w-2"
            :disabled="global.disabled || !global.configChanged"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Save
          </button>&nbsp;

          <button
            @click="restart"
            type="button"
            class="btn btn-secondary"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Restart device
          </button>&nbsp;

          <button
            @click="factory"
            type="button"
            class="btn btn-secondary"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Restore factory defaults
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { validateCurrentForm, restart } from '@/modules/utils'
import { global, config } from '@/modules/pinia'
import * as badge from '@/modules/badge'
import { logError } from '@/modules/logger'

const tempOptions = ref([
  { label: 'Celsius °C', value: 'C' },
  { label: 'Fahrenheit °F', value: 'F' }
])

const uiOptions = ref([
  { label: 'Day mode', value: false },
  { label: 'Dark mode', value: true }
])

const restartOptions = ref([
  { label: '-- disabled --', value: 0 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 60*2 },
  { label: '4 hours', value: 60*4 },
  { label: '6 hours', value: 60*6 },
  { label: '12 hours', value: 60*12 },
  { label: '24 hours', value: 60*24 },
])

const factory = () => {
  global.clearMessages()
  global.disabled = true
  fetch(global.baseURL + 'api/factory', { headers: { Authorization: global.token } })
    .then((res) => res.json())
    .then((json) => {
      if (json.success == true) {
        global.messageSuccess = json.message
        setTimeout(() => {
          location.reload(true)
        }, 2000)
      } else {
        global.messageFailed = json.message
        global.disabled = false
      }
    })
    .catch((err) => {
      logError('DeviceSettingsView:factory()', err)
      global.messageError = 'Failed to do factory restore'
      global.disabled = false
    })
}

const saveSettings = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
