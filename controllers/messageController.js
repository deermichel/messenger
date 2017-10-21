// message controller
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const Message = require("../models/messageModel")
const User = require("../models/userModel")

// get all route
exports.all = (req, res) => {
    Message.find({ $or: [{ recipient: req.user._id }, { sender: req.user._id }] })
            .populate("recipient", "username")
            .populate("sender", "username")
            .exec((error, message) => {
        if (error)
            return res.send(error)
        res.status(200).json({ messages: message })
    })
}

// filter route
exports.filter = (req, res) => {
    const userId = req.params.userId

    // check missing input
    if (!userId)
        return res.status(400).send({ "error": "Missing user." })

    // check recipient
    User.findById(userId, (error, user) => {
        if (error)
            return res.status(400).send({ "error": "Unknown user." })

        // query
        Message.find({
                    $or: [
                        { $and: [{ recipient: req.user._id }, { sender: userId }] },
                        { $and: [{ recipient: userId }, { sender: req.user._id }] }
                    ]
                })
                .populate("recipient", "username")
                .populate("sender", "username")
                .exec((error, message) => {
            if (error)
                return res.send(error)
            res.status(200).json({ messages: message })
        })
    })
}

// send route
exports.send = (req, res) => {
    const recipientId = req.body.recipient

    // check missing input
    if (!recipientId)
        return res.status(400).send({ "error": "Missing recipient." })

    // check recipient
    User.findById(recipientId, (error, recipient) => {
        if (error)
            return res.status(400).send({ "error": "Unknown recipient." })

        // create message
        let message = new Message({
            recipient: recipientId,
            sender: req.user._id,
            message: req.body.message
        })
        message.save((error, message) => {
            if (error)
                return res.send(error)

            // populate
            Message.findById(message._id)
                    .populate("recipient", "username")
                    .populate("sender", "username")
                    .exec((error, message) => {
                if (error)
                    return res.send(error)
                res.status(201).json(message)
            })
        })
    })
}
