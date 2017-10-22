// main server script
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const bodyParser = require("body-parser")
const config = require("./config/main")
const express = require("express")
const fs = require("fs")
const https = require("https")
const mongoose = require("mongoose")
const morgan = require("morgan")
const router = require("./router")

// setup express server
const server = express()

// fix mongoose promise
mongoose.Promise = global.Promise

// setup POST request parser
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

// log requests to console
server.use(morgan("dev"))

// enable CORS for clients
server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials")
    res.header("Access-Control-Allow-Credentials", "true")
    next()
})

// connect to database
console.log("connecting to database", config.database)
mongoose.connect(config.database, { useMongoClient: true })

// setup routes
router(server)

// start listening
console.log("server is running on port", config.port)
if (config.ssl) {
    https.createServer({
        key: fs.readFileSync(config.sslKeyFile),
        cert: fs.readFileSync(config.sslCertFile)
    }, server).listen(config.port)
} else {
    server.listen(config.port)
}
