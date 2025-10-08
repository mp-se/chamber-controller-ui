/*
 * Project specific data objects, should contain configData and statusData as minimum
 *
 * (c) 2023-2024 Magnus Persson
 */

export var configData = {
  // Device configuration
  id: "7376ef",
  mdns: "fridge",
  temp_format: "C",
  // Hardware
  ota_url: "",
  restart_interval: 60,
  // Wifi
  wifi_scan_ap: true,
  wifi_portal_timeout: 120,
  wifi_connect_timeout: 20,
  wifi_ssid: "network A",
  wifi_ssid2: "",
  wifi_pass: "password",
  wifi_pass2: "mypass",
  // Push - Generic
  token: "mytoken1",
  sleep_interval: 30,
  push_timeout: 10,
  // Push - Http Post 1
  http_post_target: "http://post.home.arpa:9090/api/v1/ZYfjlUNeiuyu9N/telemetry",
  http_post_header1: "Auth: Basic T7IF9DD9fF3RDddE=",
  http_post_header2: "",
  // Push - Http Post 2
  http_post2_target: "http://post2.home.arpa/ispindel",
  http_post2_header1: "",
  http_post2_header2: "",
  // Push - Http Get
  http_get_target: "http://get.home.arpa/ispindel",
  http_get_header1: "",
  http_get_header2: "",
  // Push - Influx
  influxdb2_target: "http://influx.home.arpa:8086",
  influxdb2_org: "myorg",
  influxdb2_bucket: "mybucket",
  influxdb2_token: "OijkU((jhfkh=",
  // Push - MQTT
  mqtt_target: "mqtt.home.arpa",
  mqtt_port: 1883,
  mqtt_user: "user",
  mqtt_pass: "pass",
  // Other
  dark_mode: false, 

  // Pid related params
  fridge_sensor_id: "1",
  beer_sensor_id: "2",
  fridge_sensor_offset: -1.01,
  beer_sensor_offset: 2.05,
  controller_mode: "f",
  target_temperature: 10.4,
  enable_cooling: true,
  enable_heating: true,
  ble_enabled: false
}

export var statusData = {
  id: "7376ef",
  rssi: -56,
  mdns: "fridge",
  wifi_ssid: "wifi",
  total_heap: 1000,
  free_heap: 500,
  ip: "192.0.0.1",
  wifi_setup: false,

  uptime_seconds: 1,
  uptime_minutes: 2,
  uptime_hours: 3,
  uptime_days: 4,
  
  // Pid related params
  pid_mode: "f",
  pid_state: 2,
  pid_state_string: "State string",
  pid_beer_temp: 9.5,
  pid_fridge_temp: 10.1,
  pid_beer_target_temp: 9.4,
  pid_fridge_target_temp: 9.5,
  pid_temp_format: "c",
  pid_cooling_actuator: true,
  pid_heating_actuator: false,
  pid_wait_time: 8,
  pid_time_since_cooling: 1212,
  pid_time_since_heating: 1100,
  pid_time_since_idle: 10223,
}

export var ccData = { cc: "empty" }
export var csData = { cs: "empty" }
export var cvData = { cv: "empty" }
export var mtData = { mt: "empty" }

export var featureData = {
  board: 'esp32_pro',
  platform: 'esp32c3',
  app_ver: '2.0.0',
  app_build: 'gitrev',
  firmware_file: 'firmware.bin',

  // Feature flags
  ble: true,
}

// EOF