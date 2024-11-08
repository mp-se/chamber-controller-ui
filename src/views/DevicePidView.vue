<template>
  <div class="container">
    <p></p>
    <p class="h2">Device - PID Controller Data</p>
    <p>
      This page shows the internal data structures of the BrewPi Controller. Can be used for
      troubleshooting.
    </p>
    <hr />
    <PidDataFragment source="cc"></PidDataFragment>
    <hr />
    <PidDataFragment source="cs"></PidDataFragment>
    <hr />
    <PidDataFragment source="cv"></PidDataFragment>
    <hr />
    <PidDataFragment source="mt"></PidDataFragment>
  </div>
</template>

<script setup>
import PidDataFragment from '@/fragments/PidDataFragment.vue'
</script>
