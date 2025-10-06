<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - Influxdb v2</p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-12">
          <BsInputText
            v-model="config.influxdb2_target"
            type="url"
            maxlength="120"
            label="Server"
            help="URL to push target, use format http://servername.com/resource (Supports http and https)"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.influxdb2_org"
            maxlength="50"
            label="Organisation"
            help="Identifier to what organisation to use"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.influxdb2_bucket"
            maxlength="50"
            label="Bucket"
            help="Identifier for the data bucket to use"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.influxdb2_token"
            type="password"
            maxlength="100"
            label="Authentication token"
            help="Authentication token for accessing data bucket"
            :disabled="global.disabled"
          />
        </div>
      </div>
      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-sm-3">
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
import { validateCurrentForm } from '@/modules/utils'
import { global, config } from '@/modules/pinia'

const save = async () => {
  if (!validateCurrentForm()) return

  await config.saveAll()
}
</script>
