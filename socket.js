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
    const userId = socket.request.user._id
    console.log(`[${new Date().toISOString()}] ${socket.request.connection.remoteAddress} connected to socket`)

    // events
    socket.on("disconnect", (reason) => onDisconnect(socket, reason))

    // map to user room
    socket.join(userId)

    // update last seen
    User.findByIdAndUpdate(userId, { last_seen: "online" }, (error, user) => {
        if (error) {
            console.log(`[${new Date().toISOString()}] error updating last seen of ${userId}`)
        }
    })
}

// disconnect event
const onDisconnect = (socket, reason) => {
    const userId = socket.request.user._id
    console.log(`[${new Date().toISOString()}] ${socket.request.connection.remoteAddress} disconnected from socket due to ${reason}`)

    // all clients of user left -> update last seen
    if (!io.sockets.adapter.rooms[userId]) {
        User.findByIdAndUpdate(userId, { last_seen: new Date().toISOString() }, (error, user) => {
            if (error) {
                console.log(`[${new Date().toISOString()}] error updating last seen of ${userId}`)
            }
        })
    }
}

// error event
const onError = (socket) => {
    console.log(`[${new Date().toISOString()}] socket error`)
}

// setup
exports.setup = (server) => {
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

// emit message
exports.emitMessage = (message) => {
    const senderId = message.sender._id
    const recipientId = message.recipient._id
    io.to(senderId).to(recipientId).emit("message", message)
}
