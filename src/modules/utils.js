import { ref } from 'vue'
import { logDebug, logError, logInfo } from '@mp-se/espframework-ui-components'
import { global, config } from '@/modules/pinia'

export const httpHeaderOptions = ref([
  { label: '-blank-', value: '' },
  { label: 'JSON data', value: 'Content-Type: application/json' },
  { label: 'Form data', value: 'Content-Type: x-www-form-urlencoded' },
  { label: 'Authorization', value: 'Authorization: Basic {enter token here}' },
  { label: 'No Cache', value: 'Pragma: no-cache' },
  { label: 'User agent', value: 'User-Agent: gravitymon' }
])

export const httpPostUrlOptions = ref([
  { label: '-blank-', value: '' },
  { label: 'example', value: 'http://myexample.com' }
])

export const httpGetUrlOptions = ref([
  { label: '-blank-', value: '' },
  { label: 'example', value: 'http://myexample.com' }
])

export function validateCurrentForm() {
  let valid = true
  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach((form) => {
    if (!form.checkValidity()) valid = false

    form.classList.add('was-validated')
  })

  return valid
}

export async function restart() {
  global.clearMessages()
  global.disabled = true

  const abortController = new AbortController()
  let redirectTimeout = null

  try {
    const response = await fetch(global.baseURL + 'api/restart', {
      headers: { Authorization: global.token },
      signal: abortController.signal
    })
    const json = await response.json()

    logDebug('utils.restart()', json)
    if (json.status == true) {
      global.messageSuccess =
        json.message + ' Redirecting to http://' + config.mdns + '.local in 8 seconds.'
      logInfo('utils.restart()', 'Scheduling refresh of UI')

      redirectTimeout = setTimeout(() => {
        try {
          location.href = 'http://' + config.mdns + '.local'
        } catch (error) {
          logError('utils.restart.redirect()', error)
          // Fallback to current location
          window.location.reload()
        }
      }, 8000)

      // Clean up on page unload
      window.addEventListener(
        'beforeunload',
        () => {
          if (redirectTimeout) clearTimeout(redirectTimeout)
          abortController.abort()
        },
        { once: true }
      )
    } else {
      global.messageError = json.message
      global.disabled = false
    }
  } catch (err) {
    logError('utils.restart()', err)
    global.messageError = 'Failed to restart device: ' + (err.message || err)
    global.disabled = false
  }
}

export function formatTime(t) {
  var seconds = Math.floor(t % 60)
  var minutes = Math.floor((t % (60 * 60)) / 60)
  var hours = Math.floor((t % (24 * 60 * 60)) / (60 * 60))
  var days = Math.floor((t % (7 * 24 * 60 * 60)) / (24 * 60 * 60))

  var s = ''

  if (days > 0) s += days + 'd '
  if (hours > 0) s += hours + 'h '
  if (minutes > 0) s += minutes + 'm '
  if (seconds > 0) s += seconds + 's '
  return s
}
