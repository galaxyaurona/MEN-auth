const express = require("express")
const router = express()
const {signUpController,loginController,passportSigninController,checkExistingEmail} = require("../controllers/authentication.controller")


const passport = require("passport")
const passportService = require("../services/passport")

const requireAuth = passport.authenticate('jwt',{session:false})
const requireLocalAuth = passport.authenticate('local',{session: false})

router.post("/signup", signUpController)
router.post("/login",loginController)
router.post("/signin", requireLocalAuth, passportSigninController)
router.post("/check-existing-email",checkExistingEmail)

const bootstrap = function(app) {

    app.post("/signup", signUpController)
    app.post("/signin", requireLocalAuth, passportSigninController)
    app.post("/login",loginController)
    app.post("/check-existing-email",checkExistingEmail)
} 

module.exports = {
    bootstrap,
    router
}