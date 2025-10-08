<template>
  <div class="container">
    <p></p>
    <p class="h2">Device - Settings</p>
    <hr />

    <form @submit.prevent="saveSettings" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-6">
          <BsSelect
            v-model="config.fridge_sensor_id"
            label="Chamber Sensor"
            help="Select the chamber sensor"
            :options="sensorOptions"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-6">
          <BsSelect
            v-model="config.beer_sensor_id"
            label="Beer Sensor"
            help="Select the beer sensor"
            :options="sensorOptions"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="config.beer_sensor_offset"
            label="Beer Sensor Offset"
            help="Beer sensor offset value"
            min="-5"
            max="5"
            step="0.01"
            width="4"
            unit="°C"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="config.fridge_sensor_offset"
            label="Fridge Sensor Offset"
            help="Fridge sensor offset value"
            min="-5"
            max="5"
            step="0.01"
            width="4"
            unit="°C"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-12">
          <hr />
        </div>

        <div class="col-md-4">
          <BsInputSwitch
            v-model="config.enable_cooling"
            label="Enable Cooling"
            help="If cooling circuit is available"
            width=""
            :disabled="global.disabled"
          ></BsInputSwitch>
        </div>

        <div class="col-md-4">
          <BsInputSwitch
            v-model="config.enable_heating"
            label="Enable Heating"
            help="If heating circuit is available"
            width=""
            :disabled="global.disabled"
          ></BsInputSwitch>
        </div>

        <div class="col-md-4">
          <BsInputSwitch
            v-model="config.invert_pins"
            label="Invert pins"
            help="If pins should be inverted"
            width=""
            :disabled="global.disabled"
          ></BsInputSwitch>
        </div>
      </div>

      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-3">
          <button
            type="submit"
            class="btn btn-primary w-2"
            :disabled="global.disabled || !global.configChanged"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-show="global.disabled"
            ></span>
            &nbsp;Save
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { global, config } from '@/modules/pinia'
import { logDebug } from '@mp-se/espframework-ui-components'

const sensorOptions = ref([{ label: '- not selected -', value: '' }])

onMounted(async () => {
  global.disabled = true
  const res = await config.runSensorScan()
  if (res && res.success && res.data) {
    const data = res.data
    logDebug('DeviceHardwareView::onMounted()', data)

    let fridge = false
    let beer = false

    for (const s of data.sensors) {
      if (s == config.beer_sensor_id) beer = true
      if (s == config.fridge_sensor_id) fridge = true

      sensorOptions.value.push({ label: s, value: s })
    }

    if (!beer && config.beer_sensor_id)
      sensorOptions.value.push({
        label: config.beer_sensor_id + ' (not detected)',
        value: config.beer_sensor_id
      })

    if (!fridge && config.fridge_sensor_id)
      sensorOptions.value.push({
        label: config.fridge_sensor_id + ' (not detected)',
        value: config.fridge_sensor_id
      })
  }

  global.disabled = false
})

const saveSettings = async () => {
  if (!validateCurrentForm()) return

  await config.saveAll()
}
</script>
