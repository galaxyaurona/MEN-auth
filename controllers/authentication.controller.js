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
                    err: "User exist"
                })

            // user not exist

            // check for email regex
            if (!email.match(emailRegex)) {
                return res.status(422).json({
                    success: false,
                    err: "Invalid email"
                })
            }
            // correct email format
            User.create({
                email,
                password
            }, function(err, newUser) {    
            
                if (!err) { // no error
                    console.log("user",newUser)
                    let sub = Object.assign({}, newUser._doc)
                    // delete password
                    delete sub.password;
                    console.log("sub",sub)
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
            err: "Empty username or password"
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
            // errors
            if (err) return next(err);
            // user exist
            if (!existingUser)
                return res.status(422).json({
                    success: false,
                    err: "Email does not exist"
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
                            return res.status(500).json({
                                success: false,
                                err: "Wrong username or password"
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
            err: "Empty username or password"
        })
    }
}

module.exports = {
    signUpController,
    loginController
}