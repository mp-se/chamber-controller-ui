<template>
  <div class="card h-100">
    <div class="card-header bg-success-subtle">Controller</div>
    <div class="card-body">
      <form @submit.prevent="saveSettings" class="needs-validation" novalidate>
        <div class="row">
          <div class="col-md-8">
            <div class="row text-start">
              <BsInputRadio
                v-model="newMode"
                label="Change mode"
                :options="modeOptions"
                :disabled="global.disabled"
              />
            </div>
            <div class="row text-start">
              <BsInputNumber
                v-model="newTemperature"
                label="Target temperature"
                min="0"
                max="30"
                step="0.1"
                :unit="'°' + config.temp_format"
                width="6"
                :disabled="global.disabled || modeOptions.length == 1"
              />
            </div>
          </div>
          <div class="col-md-4 text-center align-self-center justify-content-center">
            <div class="row">
              <button
                type="submit"
                class="btn btn-primary"
                style="height: 100px; width: 100px"
                :disabled="global.disabled || modeOptions.length == 1"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { validateCurrentForm } from '@/modules/utils'
import { global, config, status } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'
import BsInputRadio from '@/components/BsInputRadio.vue'
import BsInputNumber from '@/components/BsInputNumber.vue'
import { storeToRefs } from 'pinia'

const newMode = ref('o')
const newTemperature = ref(config.target_temperature)

const modeOptions = ref([{ label: 'Off', value: 'o' }])

const { pid_mode } = storeToRefs(status)

watch(pid_mode, () => {
  newMode.value = pid_mode
})

onMounted(() => {
  // We need at least one sensor to do control
  if (config.enable_cooling || config.enable_heating) {
    if (config.beer_sensor_id.length || config.fride_sensor_id.length) {
      if (config.beer_sensor_id.length)
        modeOptions.value.push({ label: 'Beer constant', value: 'b' })

      if (config.fridge_sensor_id.length)
        modeOptions.value.push({ label: 'Chamber constant', value: 'f' })
    } else {
      global.messageError = 'No sensors are configured, control is not possible'
    }
  } else {
    global.messageError = 'Neither cooling or heating is enabled, control is not possible'
  }
})

const saveSettings = () => {
  if (!validateCurrentForm()) return

  global.disabled = true

  var data = {
    new_mode: '',
    new_temperature: 0
  }

  data.new_mode = newMode.value
  data.new_temperature = newTemperature.value

  logDebug('PidController:saveSettings()', data)

  logDebug('PidController:saveSettings()', 'Sending /api/mode')
  fetch(global.baseURL + 'api/mode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: global.token },
    body: JSON.stringify(data)
  })
    .then((res) => {
      if (res.status != 200) {
        logError('configStore:saveSettings()', 'Sending /api/mode failed')
      } else {
        logInfo('configStore:saveSettings()', 'Sending /api/mode completed')
      }
      global.disabled = false
    })
    .catch((err) => {
      logError('configStore:saveSettings()', 'Sending /api/mode failed', err)
      global.disabled = false
    })
}
</script>
