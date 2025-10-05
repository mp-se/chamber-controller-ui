import { config } from '@/modules/pinia'

export function deviceBadge() {
  return deviceSettingBadge() + deviceWifiBadge()
}

export function deviceSettingBadge() {
  return deviceMdnsBadge()
}

export function deviceMdnsBadge() {
  return config.mdns === '' ? 1 : 0
}

export function deviceWifiBadge() {
  return deviceWifi1Badge() | deviceWifi2Badge() ? 1 : 0
}

export function deviceWifi1Badge() {
  if (config.wifi_ssid === '') return 1
  return 0
}

export function deviceWifi2Badge() {
  if (config.wifi_ssid2 === '' && config.wifi_ssid === '') return 1
  return 0
}

export function pushBadge() {
  return pushHttpPostBadge() + pushHttpGetBadge() + pushHttpInfluxdb2Badge() + pushHttpMqttBadge()
}

function pushTargetCount() {
  var cnt = 0
  cnt += config.http_post === '' ? 0 : 1
  cnt += config.http_get === '' ? 0 : 1
  cnt += config.influxdb2_push === '' ? 0 : 1
  cnt += config.mqtt_push === '' ? 0 : 1
  return cnt
}

export function pushHttpPostBadge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function pushHttpGetBadge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function pushHttpInfluxdb2Badge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function pushHttpMqttBadge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function deviceHardwareBadge() {
  return 0
}

export function devicePidBadge() {
  return 0
}

export function pushBluetoothBadge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function pushInfluxdb2Badge() {
  return pushTargetCount() === 0 ? 1 : 0
}
