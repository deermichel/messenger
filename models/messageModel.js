// model of an message
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const Conversation = require("./conversationModel")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// message schema
const MessageSchema = new Schema({
    recipient: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    message: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", select: false }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

// add prehook to update conversations
MessageSchema.pre("save", function(next) {
    let message = this
    Conversation.findOneAndUpdate(
        { participants: { $all: [message.sender, message.recipient] } },
        { $addToSet: { messages: message._id }, last_message: message._id },
        { upsert: false, new: true, setDefaultsOnInsert: true },
                (error, conversation) => {
            if (error)
                return next(error)

            // workaround till upsert BUG is fixed!
            if (!conversation) {
                conversation = new Conversation({
                    participants: [message.sender, message.recipient],
                    messages: [message._id],
                    last_message: message._id
                }).save((error, conversation) => {
                    if (error)
                        return next(error)
                    message.conversation = conversation
                    next()
                })
            }

            else {
                message.conversation = conversation
                next()
            }
        })
})

// JSON formatter
MessageSchema.set("toJSON", {
    transform: (doc, ret, options) => {
        ret.id = ret._id
        delete ret.__v
        delete ret._id
        delete ret.updated_at
        delete ret.created_at
    }
})

// exports
module.exports = mongoose.model("Message", MessageSchema)
