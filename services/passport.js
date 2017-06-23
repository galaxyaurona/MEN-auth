const passport = require("passport")
const User = require("../models/user");
const {secret} = require("../config");
const JwtStrategry = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;


// setup options for JWT Strategy

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: secret
}

// passport strategy login using token for middleware
const jwtLogin = new JwtStrategry(jwtOptions, (payload, done) => {
 
    User.findById(payload.sub._id, (err, user) => {
        // error handling
        if (err) {
            return done(err, false);
        }
        // user exist
        if (user) {
            // authorize user and let user go to next route
            done(null,user);
        } else {
            // reject user
            done(null,false);
        }
    })
})

// tell passport to use that strategy
passport.use(jwtLogin)