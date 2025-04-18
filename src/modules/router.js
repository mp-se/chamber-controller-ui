import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { validateCurrentForm } from '@/modules/utils'
import * as badge from '@/modules/badge'
import { global } from '@/modules/pinia'
import HomeView from '@/views/HomeView.vue'
import DeviceSettingsView from '@/views/DeviceSettingsView.vue'
import DevicePidView from '@/views/DevicePidView.vue'
import DeviceHardwareView from '@/views/DeviceHardwareView.vue'
import DeviceWifiView from '@/views/DeviceWifiView.vue'
import PushHttpPostView from '@/views/PushHttpPostView.vue'
import PushHttpGetView from '@/views/PushHttpGetView.vue'
import PushInfluxdbView from '@/views/PushInfluxdbView.vue'
import PushMqttView from '@/views/PushMqttView.vue'
import PushBluetoothView from '@/views/PushBluetoothView.vue'
import FirmwareView from '@/views/FirmwareView.vue'
import SupportView from '@/views/SupportView.vue'
import SerialView from '@/views/SerialView.vue'
import ToolsView from '@/views/ToolsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/device/settings',
    name: 'device-settings',
    component: DeviceSettingsView
  },
  {
    path: '/device/hardware',
    name: 'device-hardware',
    component: DeviceHardwareView
  },
  {
    path: '/device/pid',
    name: 'device-pid',
    component: DevicePidView
  },
  {
    path: '/device/wifi',
    name: 'device-wifi',
    component: DeviceWifiView
  },
  {
    path: '/other/firmware',
    name: 'firmware',
    component: FirmwareView
  },
  {
    path: '/push/http-post',
    name: 'push-http-post',
    component: PushHttpPostView
  },
  {
    path: '/push/http-get',
    name: 'push-http-get',
    component: PushHttpGetView
  },
  {
    path: '/push/influxdb',
    name: 'push-influxdb',
    component: PushInfluxdbView
  },
  {
    path: '/push/mqtt',
    name: 'push-mqtt',
    component: PushMqttView
  },
  {
    path: '/push/ble',
    name: 'push-ble',
    component: PushBluetoothView
  },
  {
    path: '/other/support',
    name: 'support',
    component: SupportView
  },
  {
    path: '/other/tools',
    name: 'tools',
    component: ToolsView
  },
  {
    path: '/other/serial',
    name: 'serial',
    component: SerialView
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router

router.beforeEach(() => {
  if (global.disabled) return false

  if (!validateCurrentForm()) return false

  global.clearMessages()
  return true
})

const items = ref([
  {
    label: 'Home',
    icon: 'bi-home',
    path: '/',
    subs: []
  },
  {
    label: 'Device',
    icon: 'bi-cpu',
    path: '/device',
    badge: badge.deviceBadge,
    subs: [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        badge: badge.deviceSettingBadge,
        path: '/device/settings'
      },
      {
        label: 'Hardware',
        icon: 'pi pi-cog',
        path: '/device/hardware'
      },
      {
        label: 'PID',
        icon: 'pi pi-cog',
        path: '/device/pid'
      },
      {
        label: 'Wifi',
        icon: 'pi pi-cog',
        badge: badge.deviceWifiBadge,
        path: '/device/wifi'
      }
    ]
  },
  {
    label: 'Push targets',
    icon: 'bi-cloud-up-arrow',
    path: '/push',
    badge: badge.pushBadge,
    subs: [
      // {
      //   label: 'HTTP Post',
      //   badge: badge.pushHttpPostBadge,
      //   path: '/push/http-post'
      // },
      // {
      //   label: 'HTTP Get',
      //   badge: badge.pushHttpGetBadge,
      //   path: '/push/http-get'
      // },
      {
        label: 'Influxdb v2',
        badge: badge.pushHttpInfluxdb2Badge,
        path: '/push/influxdb'
      },
      // {
      //   label: 'MQTT',
      //   badge: badge.pushHttpMqttBadge,
      //   path: '/push/mqtt'
      // }
      {
        label: 'Bluetooth',
        path: '/push/ble'
      }
    ]
  },
  {
    label: 'Other',
    icon: 'bi-tools',
    path: '/other',
    subs: [
      {
        label: 'Serial console',
        path: '/other/serial'
      },
      {
        label: 'Firmware update',
        path: '/other/firmware'
      },
      {
        label: 'Support',
        path: '/other/support'
      },
      {
        label: 'Tools',
        path: '/other/tools'
      }
    ]
  }
])

export { items }
