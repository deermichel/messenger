// socket.io integration
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const config = require("./config/main")
const jwtAuth = require("socketio-jwt-auth")
const socketio = require("socket.io")
const User = require("./models/userModel")

// socket reference
let io = undefined

// connect event
const onConnect = (socket) => {
    console.log(`[${new Date().toISOString()}] ${socket.request.connection.remoteAddress} connected to socket`)

    // events
    socket.on("disconnect", (reason) => onDisconnect(socket, reason))

    // map to user room
    socket.join(socket.request.user._id)
}

// disconnect event
const onDisconnect = (socket, reason) => {
    console.log(`[${new Date().toISOString()}] ${socket.request.connection.remoteAddress} disconnected from socket due to ${reason}`)
}

// error event
const onError = (socket) => {
    console.log(`[${new Date().toISOString()}] socket error`)
}

// setup
module.exports = (server) => {
    // bind and create
    console.log("socket is running")
    io = socketio(server)

    // authentication
    io.use(jwtAuth.authenticate({ secret: config.secret }, (payload, done) => {
        User.findById(payload._id)
                .exec((error, user) => {
            if (error)
                return done(error, false)
            if (user) {
                return done(null, user)
            } else {
                return done(null, false, "Incorrect user.")
            }
        })
    }))

    // events
    io.on("connect", onConnect)
    io.on("error", onError)
}
