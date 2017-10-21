// authentication handler
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const config = require("../config/main")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

// generate token from user object
const generateToken = (user) => {
    return jwt.sign(user, config.secret, { expiresIn: 3600 })
}

// set user info from request
const setUserInfo = (request) => {
    return {
        _id: request._id
    }
}

// login route
exports.login = (req, res, next) => {
    let userInfo = setUserInfo(req.user)
    res.status(200).json({
        token: generateToken(userInfo),
        user: req.user.getUserObject()
    })
}

// logout route
exports.logout = (req, res, next) => {
    res.status(204).send()
}

// register route
exports.register = (req, res, next) => {
    const mail = req.body.mail
    const password = req.body.password
    const username = req.body.username

    // check missing input
    if (!mail)
        return res.status(400).send({ error: "Missing mail address." })
    if (!username)
        return res.status(400).send({ error: "Missing username." })
    if (!password)
        return res.status(400).send({ error: "Missing password." })

    // check unique mail
    User.findOne({ mail }, (error, existingUser) => {
        if (error)
            return next(error)
        if (existingUser)
            return res.status(400).send({ "error": "Mail already in use." })

        // check unique username
        User.findOne({ username }, (error, existingUser) => {
            if (error)
                return next(error)
            if (existingUser)
                return res.status(400).send({ "error": "Username already in use." })

            // create user
            let user = new User({ mail, password, username })
            user.save((error, user) => {
                if (error)
                    return next(error)
                let userInfo = setUserInfo(user)
                res.status(201).json({
                    token: generateToken(userInfo),
                    user: user.getUserObject()
                })
            })
        })
    })
}
