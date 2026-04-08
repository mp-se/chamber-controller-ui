<!--
  SPDX-License-Identifier: GPL-3.0-or-later
  Copyright (C) 2024-2026 Magnus
-->

<template>
  <BsMessage :dismissable="false" alert="danger">
    Page not found! <span class="fw-bold">{{ this.$route.path }}</span> is not a valid URL for this
    application!
  </BsMessage>
</template>
