// user controller
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const User = require("../models/userModel")

// me route
exports.me = (req, res) => {
    User.findById(req.user._id, (error, user) => {
        if (error)
            return res.send(error)
        res.status(200).json(user.getUserObject())
    })
}
