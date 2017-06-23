const express = require("express")
const router = express()
const {signUpController,loginController} = require("../controllers/authentication.controller")

router.post("/sign-up", signUpController)
router.post("/login",loginController)

const passport = require("passport")
const passportService = require("../services/passport")

const requireAuth = passport.authenticate('jwt',{session:false})


const bootstrap = function(app) {

    app.get("/",requireAuth,(req,res,next)=>{
        res.json({"Hello":true})
    }) 
    app.post("/sign-up", signUpController)
    app.post("/login",loginController)
} 

module.exports = {
    bootstrap,
    router
}