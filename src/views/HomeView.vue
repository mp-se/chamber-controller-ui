<template>
  <div class="container">
    <p></p>

    <template v-if="status">
      <!-- add fatal error messages here -->
    </template>

    <div v-if="status" class="container overflow-hidden text-center">
      <div class="row gy-4">
        <div class="col-md-6">
          <PidTemperatureFragment />
        </div>

        <div class="col-md-6">
          <PidControllerFragment />
        </div>

        <template v-if="global.feature.ble_sensor">
          <template v-for="t in status.temperature_device" :key="t.device">
            <div class="col-md-4">
              <BsCard
                header="BLE Temperature Device"
                color="secondary"
                :title="t.device + ' (' + formatTime(t.update_time) + ')'"
              >
                <p class="text-center">
                  Temperature: {{ formatTemp(t.temp) }}°{{ config.temp_format }}
                </p>

                <span class="badge bg-primary">{{ t.source }}</span
                >&nbsp;
                <span class="badge bg-primary">{{ t.type }}</span>
              </BsCard>
            </div>
          </template>
        </template>

        <div class="col-md-4">
          <BsCard header="Measurement" color="info" title="Wifi">
            <p class="text-center">{{ status.rssi }} dBm - {{ status.wifi_ssid }}</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" color="info" title="IP Address">
            <p class="text-center">
              {{ status.ip }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" color="info" title="Memory">
            <p class="text-center">
              Free: {{ status.free_heap }} kb, Total: {{ status.total_heap }} kb
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" color="info" title="Software version">
            <p class="text-center">
              Firmware: {{ global.app_ver }} ({{ global.app_build }}) UI: {{ global.uiVersion }} ({{
                global.uiBuild
              }})
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" color="info" title="Platform">
            <p class="text-center">
              <span class="badge bg-secondary">{{ global.platform }}</span>
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" color="info" title="Device ID">
            <p class="text-center">{{ status.id }}</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" color="info" title="Uptime">
            <p class="text-center">
              {{ status.uptime_days }} days {{ status.uptime_hours }} hours
              {{ status.uptime_minutes }} minutes {{ status.uptime_seconds }} seconds
            </p>
          </BsCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { status, config, global } from '@/modules/pinia'
import PidControllerFragment from '@/fragments/PidControllerFragment.vue'
import PidTemperatureFragment from '@/fragments/PidTemperatureFragment.vue'

const polling = ref(null)
const timer = ref(null)

function formatTime(t) {
  if (t < 60)
    // less than 1 min
    return new Number(t).toFixed(0) + 's'

  if (t < 60 * 60)
    // less than 1 hour
    return new Number(t / 60).toFixed(0) + 'm'

  if (t < 60 * 60 * 24)
    // less than 1 day
    return new Number(t / (60 * 60)).toFixed(0) + 'h'

  return new Number(t / (60 * 60 * 24)).toFixed(0) + 'd'
}

function formatTemp(t) {
  return config.temp_format === 'C' ? new Number(t).toFixed(2) : new Number(t).toFixed(1)
}

function updateTimers() {
  // This is used to decrease timers so we can display every seconds even though status is polled every 5 seconds
  status.pid_time_since_idle += 1
  status.pid_wait_time -= 1
  status.pid_time_since_cooling += 1
  status.pid_time_since_heating += 1
}

function refresh() {
  status.load((success) => {
    if (success) {
      // TODO: Add any logic you want update as part of status update
    }
  })
}

onBeforeMount(() => {
  timer.value = setInterval(updateTimers, 1000)
  refresh()
  polling.value = setInterval(refresh, 4000)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
  clearInterval(polling.value)
})
</script>
<style></style>
