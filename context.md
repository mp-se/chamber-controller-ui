This is a vue.js project that is intended to be delivered from an ESP32 IoT device so the output needs to be one css and one js file. 

There is a mock server that is started using "npm run mock" and that needs to be running when starting the app in dev "npm run dev" or it will not start properly. 

Always validate that the application can be build using "npm run build", "npm run lint" and that the mock and dev console runs after code changes. Fix any errors that is detected.

There are two similar projects [in the parent directory gravituymon-ui](https://github.com/mp-se/gravitymon-ui) and [pressuremon-ui](https://github.com/mp-se/pressuremon-ui) use those as a base for this code since the strucutre and functionally should be similar
