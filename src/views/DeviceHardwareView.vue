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
            :options="sensorOptions"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-6">
          <BsSelect
            v-model="config.beer_sensor_id"
            label="Beer Sensor"
            :options="sensorOptions"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-12">
          <hr />
        </div>

        <div class="col-md-6">
          <BsInputSwitch
            v-model="config.enable_cooling"
            label="Enable Cooling"
            width=""
            :disabled="global.disabled"
          ></BsInputSwitch>
        </div>

        <div class="col-md-6">
          <BsInputSwitch
            v-model="config.enable_heating"
            label="Enable Heating"
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
              :hidden="!global.disabled"
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
import { validateCurrentForm } from '@/modules/utils'
import { global, config } from '@/modules/pinia'
import { logDebug } from '@/modules/logger'

const sensorOptions = ref([{ label: '- not selected -', value: "" }])

onMounted(() => {
  global.disabled = true
  config.runSensorScan((success, data) => {
    if (success) {
      logDebug('DeviceHardwareView::onMounted()', data)

      var fridge = false, beer = false
    
      for (var s in data.sensors) {
        if(s == config.beer_sensor_id) beer = true
        if(s == config.fridge_sensor_id) fridge = true
        
        sensorOptions.value.push({ label: data.sensors[s], value: data.sensors[s] })
      }

      if(!beer)
        sensorOptions.value.push({ label: config.beer_sensor_id + " (not detected)", value: config.beer_sensor_id })

      if(!fridge)
        sensorOptions.value.push({ label: config.fridge_sensor_id + " (not detected)", value: config.fridge_sensor_id })
    }

    global.disabled = false
  })
})

const saveSettings = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
