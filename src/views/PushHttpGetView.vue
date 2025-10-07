<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - HTTP Get</p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_get_target"
            type="url"
            maxlength="120"
            label="Http Get URL"
            help="URL to push target, use format http://servername.com/resource (Supports http and https)"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined URLs"
            button="URL"
            :options="httpGetUrlOptions"
            :callback="httpUrlCallback"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_get_header1"
            maxlength="120"
            pattern="(.+): (.+)"
            label="Http Post Header #1"
            help=""
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined headers"
            button="Header"
            :options="httpHeaderOptions"
            :callback="httpHeaderH1Callback"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_get_header2"
            maxlength="120"
            pattern="(.+): (.+)"
            label="Http Post Header #2"
            help="Set a http headers, empty string is skipped, example: Content-Type: application/json"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined headers"
            button="Header"
            :options="httpHeaderOptions"
            :callback="httpHeaderH2Callback"
            :disabled="global.disabled"
          />
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
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { httpGetUrlOptions, httpHeaderOptions } from '@/modules/utils'
import { global, config } from '@/modules/pinia'

const httpUrlCallback = (opt) => {
  config.http_get = opt
}

const httpHeaderH1Callback = (opt) => {
  config.http_get_h1 = opt
}

const httpHeaderH2Callback = (opt) => {
  config.http_get_h2 = opt
}

const save = async () => {
  if (!validateCurrentForm()) return

  await config.saveAll()
}
</script>
