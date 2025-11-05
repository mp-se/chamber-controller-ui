<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - Bluetooth</p>
    <hr />

    <template v-if="global.feature.ble">
      <form @submit.prevent="save" class="needs-validation" novalidate>
        <div class="row">
          <div class="col-md-12">
            <BsInputSwitch
              v-model="config.ble_enabled_push"
              label="Enable temperature sending over bluetooth"
              :disabled="global.disabled"
            />
          </div>
          <div class="col-md-12">
            <p></p>
            <p>Changing bluetooth settings might require a restart to function properly</p>
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
    </template>
    <template v-else>
      <div class="row">
        <div class="col-md-12">
          <p>Bluetooth is not available on this platform</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { global, config } from '@/modules/pinia'

const save = async () => {
  if (!validateCurrentForm()) return

  global.clearMessages()
  await config.saveAll()
}
</script>
