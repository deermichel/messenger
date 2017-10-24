// passport configuration
// (c) 2017 Micha Hanselmann

"use strict"

// imports
const config = require("./main")
const ExtractJwt = require("passport-jwt").ExtractJwt
const JwtStrategy = require("passport-jwt").Strategy
const LocalStrategy = require("passport-local")
const passport = require("passport")
const User = require("../models/userModel")

// setup local login strategy
const localLogin = new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, "+password +mail +contacts")
            .populate("contacts")
            .exec((error, user) => {
        if (error)
            return done(error)
        if (!user)
            return done(null, false, { error: "Incorrect login details." })
        user.checkPassword(password, (error, isMatch) => {
            if (error)
                return done(error)
            if (!isMatch)
                return done(null, false, { error: "Incorrect login details." })
            return done(null, user)
        })
    })
})

// setup JWT login strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
}
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload._id, "+mail +contacts")
            .exec((error, user) => {
        if (error)
            return done(error, false)
        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
})

// setup passport login strategies
passport.use(jwtLogin)
passport.use(localLogin)
