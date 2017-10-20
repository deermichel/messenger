// routes the user through the jungle of possiblities
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const AuthenticationController = require("./controllers/authentication")
const express = require("express")
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

    // auth routes
    apiRoutes.use("/", authRoutes)
    authRoutes.post("/register", AuthenticationController.register)
    authRoutes.post("/login", requireLogin, AuthenticationController.login)
    authRoutes.post("/logout", requireAuth, AuthenticationController.logout)

    // normal routes
    apiRoutes.get("/", requireAuth, (req, res) => {
        console.log(req.user)
        res.send("Nice! ID:" + req.user._id + " Username:" + req.user.username)
    })

    // set url for group routes
    server.use("/api/v1", apiRoutes)
}
