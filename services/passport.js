const passport = require("passport")
const User = require("../models/user");
const {
    secret
} = require("../config");
const JwtStrategry = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local")

// 

const localOptions = {
    usernameField: 'email'
};
const localLogins = new LocalStrategy(localOptions, function(email, password, done) {
    if (password && email) { // if password and email both not null
        // find existing email in database
        User.findOne({
            email
        }, (err, existingUser) => {
            // errors
              
            if (err) return done(err);
            // user doesnt exist
            if (!existingUser) {
                done(null,false)
            } else {
                existingUser.comparePassword(password,(err, isMatch) => {
                 
                    if (err) return done(err)
                    if (isMatch)
                        done(null,existingUser)
                    else
                        done(null,false)
                })
            }


        })
    }
})

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
            done(null, user);
        }
        else {
            // reject user
            done(null, false);
        }
    })
})

// tell passport to use that strategy
passport.use(jwtLogin)
passport.use(localLogins)