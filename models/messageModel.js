// model of an message
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// message schema
const MessageSchema = new Schema({
    recipient: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    message: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
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
