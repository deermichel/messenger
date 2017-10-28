// conversation controller
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const Conversation = require("../models/conversationModel")
const User = require("../models/userModel")

// get all route
exports.all = (req, res) => {
    Conversation.find({ participants: req.user._id })
            .populate("participants")
            .populate("last_message")
            .exec((error, conversation) => {
        if (error)
            return res.send(error)
        res.status(200).json({ conversations: conversation })
    })
}

// with route
exports.with = (req, res) => {
    const userId = req.params.userId

    // check missing input
    if (!userId)
        return res.status(400).send({ "error": "Missing user." })

    // check user
    User.findById(userId, (error, user) => {
        if (error || !user)
            return res.status(400).send({ "error": "Unknown user." })

        // query
        Conversation.findOne({ participants: { $all: [req.user._id, userId] } })
                .populate("participants")
                .populate("last_message")
                .populate("messages")
                .exec((error, conversation) => {
            if (error)
                return res.send(error)
            res.status(200).json(conversation)
        })
    })
}
