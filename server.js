// main server script
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const bodyParser = require("body-parser")
const config = require("./config/main")
const express = require("express")
const fs = require("fs")
const http = require("http")
const https = require("https")
const mongoose = require("mongoose")
const morgan = require("morgan")
const router = require("./router")
const socket = require("./socket")

// setup express server
const app = express()

// fix mongoose promise
mongoose.Promise = global.Promise

// setup POST request parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// log requests to console
app.use(morgan("combined"))

// enable CORS for clients
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials")
    res.header("Access-Control-Allow-Credentials", "true")
    next()
})

// connect to database
console.log("connecting to database", config.database)
mongoose.connect(config.database, { useMongoClient: true })

// create server
let server = undefined
if (config.ssl) {
    server = https.createServer({
        key: fs.readFileSync(config.sslKeyFile),
        cert: fs.readFileSync(config.sslCertFile)
    }, app)
} else {
    server = http.createServer(app)
}

// setup routes
router(app)

// setup socket
socket(server)

// start listening
console.log("server is running on port", config.port)
server.listen(config.port)
