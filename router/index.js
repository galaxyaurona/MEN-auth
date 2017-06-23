const express = require("express")
const router = express()
const {signUpController,loginController,passportSigninController} = require("../controllers/authentication.controller")

router.post("/sign-up", signUpController)
router.post("/login",loginController)

const passport = require("passport")
const passportService = require("../services/passport")

const requireAuth = passport.authenticate('jwt',{session:false})
const requireLocalAuth = passport.authenticate('local',{session: false})

const bootstrap = function(app) {

    app.get("/",requireAuth,(req,res,next)=>{
        res.json({"Hello":true})
    }) 
    app.post("/signup", signUpController)
    app.post("/signin", requireLocalAuth, passportSigninController)
    app.post("/login",loginController)
} 

module.exports = {
    bootstrap,
    router
}