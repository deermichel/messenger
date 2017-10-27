// model of a conversation
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// conversation schema
const ConversationSchema = new Schema({
    participants: { type: [{ type: Schema.Types.ObjectId, ref: "User" }] },
    messages: { type: [{ type: Schema.Types.ObjectId, ref: "Message" }] },
    last_message: { type: Schema.Types.ObjectId, ref: "Message" }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

// JSON formatter
ConversationSchema.set("toJSON", {
    transform: (doc, ret, options) => {
        ret.id = ret._id
        delete ret.__v
        delete ret._id
        delete ret.updated_at
        delete ret.created_at
    }
})

// exports
module.exports = mongoose.model("Conversation", ConversationSchema)
