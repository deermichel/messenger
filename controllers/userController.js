// user controller
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const User = require("../models/userModel")

// me route
exports.me = (req, res) => {
    User.findById(req.user._id, "+mail +contacts")
            .populate("contacts")
            .exec((error, user) => {
        if (error)
            return res.send(error)
        res.status(200).json(user)
    })
}

// search route
exports.search = (req, res) => {
    const query = req.query.q

    // check missing input
    if (!query)
        return res.status(400).send({ error: "Missing query." })

    const regex = { $regex: req.query.q, $options: "i" }
    User.find({ $or: [{ username: regex }, { mail: regex }] })
            .exec((error, user) => {
        if (error)
            return res.send(error)
        res.status(200).json({ users: user })
    })
}
