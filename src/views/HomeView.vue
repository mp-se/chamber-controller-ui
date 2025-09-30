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

        <div class="col-md-4">
          <BsCard header="Measurement" title="Wifi">
            <p class="text-center">{{ status.rssi }} dBm - {{ status.wifi_ssid }}</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="IP Address">
            <p class="text-center">
              {{ status.ip }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Memory">
            <p class="text-center">
              Free: {{ status.free_heap }} kb, Total: {{ status.total_heap }} kb
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Software version">
            <p class="text-center">
              Firmware: {{ status.app_ver }} ({{ status.app_build }}) UI: {{ global.uiVersion }} ({{
                global.uiBuild
              }})
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Platform">
            <p class="text-center">
              <span class="badge bg-secondary">{{ status.platform }}</span>
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Device ID">
            <p class="text-center">{{ status.id }}</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Uptime">
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
import { status, global } from '@/modules/pinia'
import PidControllerFragment from '@/fragments/PidControllerFragment.vue'
import PidTemperatureFragment from '@/fragments/PidTemperatureFragment.vue'

const polling = ref(null)
const timer = ref(null)

function updateTimers() {
  // This is used to decrease timers so we can display every seconds even though status is polled every 5 seconds
  status.pid_time_since_idle += 1
  status.pid_wait_time -= 1
  status.pid_time_since_cooling += 1
  status.pid_time_since_heating += 1
}

onBeforeMount(() => {
  timer.value = setInterval(updateTimers, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})

function refresh() {
  status.load((success) => {
    if (success) {
      // TODO: Add any logic you want update as part of status update
    }
  })
}

onBeforeMount(() => {
  refresh()
  polling.value = setInterval(refresh, 4000)
})

onBeforeUnmount(() => {
  clearInterval(polling.value)
})
</script>

<style></style>
