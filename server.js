// initialize .env variable
require("dotenv").config()

// import modules
const path = require('path');
const http = require('http');
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("./models/user")
const cors = require('cors')
const {
  databaseURL,
  emailRegex,
  secret
} = require("./config")

const async = require('async');
const socketio = require('socket.io');
const express = require('express');




// intialize router and server
const router = express();
const server = http.createServer(router);
const io = socketio.listen(server);

// database connection
mongoose.connect(databaseURL, {}, (err) => {
  if (!err) {
    console.log("successfully connect to database")
  }
  else {
    console.log("DB CONNECTION ERROR:", err)
  }
})

// config router

// parse json and form encoded
router.use(bodyParser.json({
  type: "*/*"
}))
router.use(cors())
router.use(bodyParser.urlencoded())


// bootstrapping default route (roots)
var apiRouter = require("./router")

router.use("/api",apiRouter.router)




router.use(express.static(path.resolve(__dirname, 'client')));




server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  const addr = server.address();
  console.log("Authenticate server listening at", addr.address + ":" + addr.port);
});
