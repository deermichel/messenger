// model of an message
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// message schema
const MessageSchema = new Schema({
    recipient: { type: Schema.Types.ObjectId, required: true },
    sender: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

// exports
module.exports = mongoose.model("Message", MessageSchema)
