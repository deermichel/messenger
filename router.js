// routes the user through the jungle of possiblities
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const AuthenticationController = require("./controllers/authController")
const express = require("express")
const MessageController = require("./controllers/messageController")
const passport = require("passport")

// setup passport middleware
const passportConfig = require("./config/passport")
const requireAuth = passport.authenticate("jwt", { session: false })
const requireLogin = passport.authenticate("local", { session: false })

// routing
module.exports = (server) => {
    // route groups
    const apiRoutes = express.Router()
    const authRoutes = express.Router()
    const messageRoutes = express.Router()

    // auth routes
    apiRoutes.use("/auth", authRoutes)
    authRoutes.post("/register", AuthenticationController.register)
    authRoutes.post("/login", requireLogin, AuthenticationController.login)
    authRoutes.post("/logout", requireAuth, AuthenticationController.logout)

    // message routes
    apiRoutes.use("/message", messageRoutes)
    messageRoutes.get("/all", requireAuth, MessageController.all)
    messageRoutes.post("/send", requireAuth, MessageController.send)

    // normal routes
    apiRoutes.get("/", requireAuth, (req, res) => {
        console.log(req.user)
        res.send("Nice! ID:" + req.user._id + " Username:" + req.user.username)
    })

    // set url for group routes
    server.use("/api/v1", apiRoutes)
}
