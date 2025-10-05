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
import { logDebug, logError, logInfo } from '@mp-se/espframework-ui-components'
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
    if (config.beer_sensor_id.length || config.fridge_sensor_id.length) {
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

const saveSettings = async () => {
  try {
    if (!validateCurrentForm()) return

    global.disabled = true
    global.clearMessages()

    const data = {
      new_mode: newMode.value,
      new_temperature: newTemperature.value
    }

    logDebug('PidControllerFragment.saveSettings()', data)
    logInfo('PidControllerFragment.saveSettings()', 'Sending /api/mode')

    const response = await fetch(global.baseURL + 'api/mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: global.token },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(global.fetchTimeout)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    logInfo('PidControllerFragment.saveSettings()', 'Sending /api/mode completed')
    global.messageSuccess = 'PID controller settings updated successfully'

  } catch (err) {
    logError('PidControllerFragment.saveSettings()', err)
    global.messageError = 'Failed to update PID controller: ' + (err.message || err)
  } finally {
    global.disabled = false
  }
}
</script>
