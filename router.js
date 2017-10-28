// routes the user through the jungle of possiblities
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const AuthenticationController = require("./controllers/authController")
const ContactController = require("./controllers/contactController")
const ConversationController = require("./controllers/conversationController")
const express = require("express")
const MessageController = require("./controllers/messageController")
const passport = require("passport")
const UserController = require("./controllers/userController")

// setup passport middleware
const passportConfig = require("./config/passport")
const requireAuth = passport.authenticate("jwt", { session: false })
const requireLogin = passport.authenticate("local", { session: false })

// routing
module.exports = (app) => {
    // route groups
    const apiRoutes = express.Router()
    const authRoutes = express.Router()
    const contactRoutes = express.Router()
    const conversationRoutes = express.Router()
    const messageRoutes = express.Router()
    const userRoutes = express.Router()

    // auth routes
    apiRoutes.use("/auth", authRoutes)
    authRoutes.post("/register", AuthenticationController.register)
    authRoutes.post("/login", requireLogin, AuthenticationController.login)
    authRoutes.post("/logout", requireAuth, AuthenticationController.logout)

    // contact routes
    apiRoutes.use("/contact", contactRoutes)
    contactRoutes.get("/all", requireAuth, ContactController.all)
    contactRoutes.post("/add", requireAuth, ContactController.add)
    contactRoutes.post("/delete", requireAuth, ContactController.delete)

    // conversation routes
    apiRoutes.use("/conversation", conversationRoutes)
    conversationRoutes.get("/all", requireAuth, ConversationController.all)
    conversationRoutes.get("/with/:userId", requireAuth, ConversationController.with)

    // message routes
    apiRoutes.use("/message", messageRoutes)
    messageRoutes.get("/all", requireAuth, MessageController.all)
    messageRoutes.get("/filter/:userId", requireAuth, MessageController.filter)
    messageRoutes.post("/send", requireAuth, MessageController.send)

    // user routes
    apiRoutes.use("/user", userRoutes)
    userRoutes.get("/me", requireAuth, UserController.me)
    userRoutes.get("/search", requireAuth, UserController.search)

    // set url for group routes
    app.use("/api/v1", apiRoutes)

    // 404 catchall
    app.use((req, res) => {
        res.status(404).send({ error: req.originalUrl + " not found." })
    })
}
