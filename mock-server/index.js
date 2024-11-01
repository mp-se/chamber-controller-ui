/*
 * Project specific mock server
 *
 * (c) 2023-2024 Magnus Persson
 */
import { createRequire } from "module";
import { registerEspFwk } from './espfwk.js'
import { configData, statusData,ccData, csData, cvData, mtData } from './data.js'

const require = createRequire(import.meta.url);
const express = require('express')
var cors = require('cors')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

registerEspFwk(app)

app.get('/api/ping', (req, res) => {
  console.log('GET: /api/ping')
  /* 
   * Description:    Check for response from device. 
   * Authentication: Required
   * Limitation:     - 
   * Return:         200 OK
   */
  var data = {
    status: true,
  }
  res.type('application/json')
  res.send(data)
})

app.post('/api/mode', (req, res) => {
  console.log('POST: /api/mode')
  /* 
   * Description:    Set the pid controller mode and temperature. 
   * Authentication: Required
   * Limitation:     - 
   * Request:        { newMode: "o|f|b", newTemperature: 10 } 
   * Return:         200 OK
   */

  statusData.pid_mode = configData.mode = req.body.newMode
  statusData.pid_beer_target_temp = statusData.pid_fridge_target_temp = req.body.newTemperature

  var data = {
    status: true,
    pid_mode: statusData.pid_mode,
    pid_beer_target_temp: statusData.pid_beer_target_temp,
    pid_fridge_target_temp: statusData.pid_fridge_target_temp,
    message: "Mode updated"
  }
  res.type('application/json')
  res.send(data)
})

var sensorScanning = false

app.get('/api/sensor/status', (req, res) => {
  console.log('GET: /api/sensor')
  res.type('application/json')
  if (sensorScanning) {
    var data = {
      status: true,
      success: false,
      message: 'Sensor scan running...'
    }
  } else {
    data = {
      status: false,
      success: true,
      message: 'Sensor scan completed...',
      sensors: [
        "SENSOR 1",
        "SENSOR 2"
      ]
    }
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/sensor', (req, res) => {
  console.log('GET: /api/sensor')
  res.type('application/json')

  sensorScanning = true
  setTimeout(() => {
    sensorScanning = false
  }, 2000)

  var data = {
    success: true,
    message: 'Sensor scan started.'
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/pid/cc', (req, res) => {
  console.log('GET: /api/pid/cc')
  res.type('application/json')
  res.send(ccData)
})

app.get('/api/pid/cs', (req, res) => {
  console.log('GET: /api/pid/cs')
  res.type('application/json')
  res.send(csData)
})

app.get('/api/pid/cv', (req, res) => {
  console.log('GET: /api/pid/cv')
  res.type('application/json')
  res.send(cvData)
})

app.get('/api/pid/mt', (req, res) => {
  console.log('GET: /api/pid/mt')
  res.type('application/json')
  res.send(mtData)
})

app.listen(port, "localhost", () => {
  console.log(`EspFramework API simulator port http://localhost:${port}/`)
})