import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import piniaInstance from './modules/pinia.js'
app.use(piniaInstance)

import router from './modules/router.js'
app.use(router)

// Import components from espframework library
import {
  BsMessage,
  BsCard,
  BsFileUpload,
  BsProgress,
  BsInputBase,
  BsInputText,
  BsInputReadonly,
  BsSelect,
  BsInputTextArea,
  BsInputNumber,
  BsInputSwitch,
  BsInputRadio,
  BsDropdown,
  BsModalConfirm,
  BsMenuBar,
  BsFooter,
  BsModal,
  BsInputTextAreaFormat
} from '@mp-se/espframework-ui-components'

app.component('BsMessage', BsMessage)
app.component('BsDropdown', BsDropdown)
app.component('BsCard', BsCard)
app.component('BsFileUpload', BsFileUpload)
app.component('BsProgress', BsProgress)
app.component('BsInputBase', BsInputBase)
app.component('BsInputText', BsInputText)
app.component('BsInputReadonly', BsInputReadonly)
app.component('BsSelect', BsSelect)
app.component('BsInputTextArea', BsInputTextArea)
app.component('BsInputNumber', BsInputNumber)
app.component('BsInputRadio', BsInputRadio)
app.component('BsInputSwitch', BsInputSwitch)
app.component('BsModalConfirm', BsModalConfirm)
app.component('BsMenuBar', BsMenuBar)
app.component('BsFooter', BsFooter)
app.component('BsModal', BsModal)
app.component('BsInputTextAreaFormat', BsInputTextAreaFormat)

// Import icons from espframework library
import {
  IconHome,
  IconTools,
  IconGraphUpArrow,
  IconCloudUpArrow,
  IconUpArrow,
  IconCpu,
  IconEye,
  IconEyeSlash,
  IconWifi,
  IconCheckCircle,
  IconXCircle,
  IconInfoCircle,
  IconExclamationTriangle
} from '@mp-se/espframework-ui-components'

app.component('IconHome', IconHome)
app.component('IconTools', IconTools)
app.component('IconGraphUpArrow', IconGraphUpArrow)
app.component('IconCloudUpArrow', IconCloudUpArrow)
app.component('IconUpArrow', IconUpArrow)
app.component('IconCpu', IconCpu)
app.component('IconEye', IconEye)
app.component('IconEyeSlash', IconEyeSlash)
app.component('IconWifi', IconWifi)
app.component('IconCheckCircle', IconCheckCircle)
app.component('IconXCircle', IconXCircle)
app.component('IconInfoCircle', IconInfoCircle)
app.component('IconExclamationTriangle', IconExclamationTriangle)

// Import Bootstrap CSS first
import 'bootstrap/dist/css/bootstrap.css'
// Import Bootstrap JS bundle - this provides window.bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.js'
// Import espframework CSS last to allow overrides
import '@mp-se/espframework-ui-components/dist/style.css'

// Mount the app
app.mount('#app')
