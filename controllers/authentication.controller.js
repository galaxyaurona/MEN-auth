const {
    databaseURL,
    emailRegex,
    secret
} = require("../config")

const User = require("../models/user")
const jwt = require("jsonwebtoken")

const signUpController = (req, res, next) => {

    const email = req.body.email
    const password = req.body.password
    if (password && email) { // if password and email both not null
        // find existing email in database
        User.findOne({
            email
        }, function(err, existingUser) {
            // errors
            if (err) return next(err);
            // user exist
            if (existingUser)
                return res.status(422).json({
                    success: false,
                    err: {
                        src: "email",
                        msg: "This email are being used"
                    }
                })

            // user not exist

            // check for email regex
            if (!email.match(emailRegex)) {
                return res.status(422).json({
                    success: false,
                    err: {
                        src: "email",
                        msg: "Invalid email format"
                    }
                })
            }
            // correct email format
            User.create({
                email,
                password
            }, function(err, newUser) {

                if (!err) { // no error

                    let sub = Object.assign({}, newUser._doc)
                        // delete password
                    delete sub.password;

                    // sign
                    let token = jwt.sign({
                        sub,
                        iat: new Date().getTime()
                    }, secret)
                    return res.json({
                        success: true,
                        token: token
                    })
                }
                else { // database error , possibly validation

                    return res.status(500).json({
                        success: false,
                        err: err
                    })
                }

            })
        })
    }
    else {
        return res.status(422).json({
            success: false,
            err: {
                src: "multiple",
                msg: "Empty email or password field"
            }
        })
    }


}

const checkExistingEmail = (req, res, next) => {

    const email = req.body.email

    if (email) { // if password and email both not null
        // find existing email in database
        User.findOne({
            email
        }, function(err, existingUser) {
            // errors
            if (err) return next(err);
            // user exist
            if (existingUser) {
                return res.status(422).json({
                    success: false,
                    err: {
                        src: "email",
                        msg: "This email are being used"
                    }
                })
            }
            else {
                // user not exist
                return res.json({
                    success: true,
                    err: "Email is free to use"
                })
            }

        })

    }
    else {
        return res.status(422).json({
            success: false,
            err: "Empty email field supplied"
        })
    }


}

const loginController = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    if (password && email) {
        User.findOne({
            email
        }, (err, existingUser) => {
            // errors handling
            if (err) return next(err);
            // user does not exist
            if (!existingUser)
                return res.status(422).json({
                    success: false,
                    err: {
                        source: "email",
                        msg: "Email does not exist"
                    }
                })
            else {
                existingUser.comparePassword(password, (err, isMatch) => {
                    // error in comparing password
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            err: err
                        })
                    }
                    else {
                        if (isMatch) {
                            // constructing token
                            let sub = Object.assign({}, existingUser._doc)
                                // delete password
                            delete sub.password;
                            // sign
                            const token = jwt.sign({
                                    sub,
                                    iat: new Date().getTime()
                                }, secret)
                                // response
                            return res.json({
                                success: true,
                                token: token
                            })

                        }
                        else { // password doesn't match
                            return res.status(422).json({
                                success: false,
                                err: {
                                    source: "password",
                                    msg: "Password does not match"
                                }
                            })
                        }
                    }
                })
            }

            // user not exist
        })


    }
    else {
        return res.status(422).json({
            success: false,
            err: "Empty email or password"
        })
    }
}


const passportSigninController = function(req, res, next) {
    // user has been authed here,
    // give them token
    // assuming the middleware find the email
    const sub = Object.assign({}, req.user._doc)
    const token = jwt.sign({
        sub,
        iat: new Date().getTime()
    }, secret)
    res.json({
        success: true,
        token
    })
}

module.exports = {
    signUpController,
    loginController,
    passportSigninController,
    checkExistingEmail
}