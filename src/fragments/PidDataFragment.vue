<template>
  <p class="h4">{{ dataSource }}</p>

  <div class="row">
    <pre>{{ dataFormatted }}</pre>
  </div>
  <div class="row">
    <div class="col">
      <button @click="load()" type="button" class="btn btn-primary w-4" :disabled="global.disabled">
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          :hidden="!global.disabled"
        ></span>
        &nbsp;Reload
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { global } from '@/modules/pinia'
import { logError, logDebug } from '@/modules/logger'

const data = ref('')
const source = defineModel('source')

const dataSource = computed(() => {
  if (source.value == 'cc') return 'Control Constants'
  if (source.value == 'cv') return 'Control Variables'
  if (source.value == 'mt') return 'Min Times'
  if (source.value == 'cs') return 'Control Settings'
  return 'Unknown'
})

const dataFormatted = computed(() => {
  try { 
//    return JSON.stringify(JSON.parse(data.value), null, 2) 
    return JSON.stringify(data.value, null, 2) 
} catch(e) { 
    logError("PidDataFragment::dataFormatted()", e)
  }
  return "Fetching data..."
})

onMounted(() => {
  load()
})

const load = () => {
  logDebug('DevicePidsView:load()')
  global.clearMessages()
  global.disabled = true
  fetch(global.baseURL + 'api/pid/' + source.value, { headers: { Authorization: global.token } })
    .then((res) => res.json())
    .then((json) => {
      logDebug('DevicePidsView:load()', json)
      data.value = json
      global.disabled = false
    })
    .catch((err) => {
      logError('DevicePidsView:load()', err)
      global.messageError = 'Failed to do load data from /api/' + source.value
      global.disabled = false
    })
}
</script>
