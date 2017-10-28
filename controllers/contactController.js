// contact controller
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const Conversation = require("../models/conversationModel")
const User = require("../models/userModel")

// get all route
exports.all = (req, res) => {
    User.findById(req.user._id)
            .populate("contacts")
            .exec((error, user) => {
        if (error)
            return res.send(error)
        res.status(200).json({ contacts: user.contacts })
    })
}

// add route
exports.add = (req, res) => {
    const userId = req.body.user

    // check missing input
    if (!userId)
        return res.status(400).send({ "error": "Missing user." })

    // check user
    User.findById(userId, (error, contact) => {
        if (error || !contact)
            return res.status(400).send({ "error": "Unknown user." })

        // add user to contacts
        let user = req.user
        if (!user.contacts.find((id) => id == userId))
            user.contacts.push(userId)
        user.save((error, user) => {
            if (error)
                return res.send(error)

            // populate all contacts
            User.findById(user._id)
                    .populate("contacts")
                    .exec((error, user) => {
                if (error)
                    return res.send(error)
                res.status(201).json({ contacts: user.contacts })
            })
        })
    })
}

// delete route
exports.delete = (req, res) => {
    const userId = req.body.user

    // check missing input
    if (!userId)
        return res.status(400).send({ "error": "Missing user." })

    // remove user from contacts
    let user = req.user
    user.contacts = user.contacts.filter((id) => id != userId)
    user.save((error, user) => {
        if (error)
            return res.send(error)

        // populate all contacts
        User.findById(user._id)
                .populate("contacts")
                .exec((error, user) => {
            if (error)
                return res.send(error)
            res.status(200).json({ contacts: user.contacts })
        })
    })
}
