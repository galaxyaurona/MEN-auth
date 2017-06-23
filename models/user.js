const mongoose =  require("mongoose")
const bcrypt = require("bcrypt")
const SALT_ROUNDS = 10;
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase:true,
        required:true
    },
    password: {
        type: String,
        password: String,
        required: true
    }
});
// hash password
UserSchema.pre("save", function(next){

    const user = this;

    //only has if password has been modified
    if (!user.isModified('password')) return next();
    
    // hash password
    bcrypt.hash(user.password,SALT_ROUNDS,(err,hash) => {
        if (err) return next(err)
        user.password = hash
        return next()
    })
})

UserSchema.methods.comparePassword = function (candidatePassword,callback) {
   
    bcrypt.compare(candidatePassword,this.password, function(err,isMatch){
        if (err) return callback(err)
        callback(null,isMatch)
    })
}

module.exports = mongoose.model('User',UserSchema)