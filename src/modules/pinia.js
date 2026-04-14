/*
 * Chamber Controller UI
 * Copyright (c) 2021-2026 Magnus
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import { ref } from 'vue'
import { createPinia } from 'pinia'
import { useGlobalStore } from '@/modules/globalStore'
import { useStatusStore } from '@/modules/statusStore'
import { useConfigStore } from '@/modules/configStore'
import { logDebug } from '@mp-se/espframework-ui-components'

const piniaInstance = createPinia()

export default piniaInstance

const config = useConfigStore(piniaInstance)
const global = useGlobalStore(piniaInstance)
const status = useStatusStore(piniaInstance)

export { global, status, config }

const configCompare = ref(null)

// This function is now also defined in configStore.js
// Keeping this here for the $subscribe mechanism
const saveConfigState = () => {
  logDebug('pinia:saveConfigState()', 'Saving state')

  configCompare.value = {}
  for (var key in config) {
    if (typeof config[key] !== 'function' && key !== '$id') {
      configCompare.value[key] = config[key]
    }
  }

  logDebug('pinia:saveConfigState()', 'Saved state: ', configCompare.value)
  global.configChanged = false
}

// This function is now also defined in configStore.js
// Keeping this here for the $subscribe mechanism
const getConfigChanges = () => {
  var changes = {}

  if (configCompare.value === null) {
    logDebug('pinia:getConfigChanges()', 'configState not saved')
    return changes
  }

  for (var key in configCompare.value) {
    // TODO: If there are nested structures they need to be handled here...

    if (configCompare.value[key] != config[key]) {
      changes[key] = config[key]
    }
  }

  return changes
}

config.$subscribe(() => {
  if (!global.initialized) return

  var changes = getConfigChanges()
  logDebug('pinia:$subscribe()', 'State change on configStore', changes)

  if (JSON.stringify(changes).length > 2) {
    global.configChanged = true
    logDebug('pinia:$subscribe()', 'Changed properties:', changes)
  } else {
    global.configChanged = false
  }
})

// Export these for backward compatibility with code that might import from pinia.js
export { saveConfigState, getConfigChanges }
