// model of an average semi-aged user - better known as John Doe
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

// user schema
const UserSchema = new mongoose.Schema({
    mail: { type: String, unique: true, required: true, trim: true },
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

// add prehook to hash password before saving
UserSchema.pre("save", function(next) {
    let user = this
    if (!user.isModified("password"))
        return next()
    bcrypt.hash(user.password, 10, (error, hash) => {
        if (error)
            return next(error)
        user.password = hash
        next()
    })
})

// password check method
UserSchema.methods.checkPassword = function(password, callback) {
    bcrypt.compare(password, this.password, (error, isMatch) => {
        if (error)
            return callback(error)
        callback(null, isMatch)
    })
}

// create user object (for client)
UserSchema.methods.getUserObject = function(withMail) {
    let user = this.toObject()
    return {
        mail: (withMail) ? user.mail : undefined,
        username: user.username,
        id: user._id
    }
}

// transform for client
UserSchema.set("toJSON", {
    transform: function(doc, ret, options) {
        ret.id = ret._id
        delete ret.__v
        delete ret._id
        delete ret.updated_at
        delete ret.created_at
    }
})

// exports
module.exports = mongoose.model("User", UserSchema)
