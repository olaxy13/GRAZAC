const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator");
const crypto = require("crypto");

const userSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: true, 
        //minlength:[8,"Password must be more than 8 characters"],
        select:false
    },
    passwordConfirm: {
        type:String,
    },
    confirmEmail: {
      type: Boolean,
      default: false
    },
    confirmEmailToken: Number,
    passwordChangedAt: Date,
    passwordResetToken: Number,

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
    confirmEmailTokenExpires: Date, 



})

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next()
        this.password = await bcrypt.hash(this.password, 12)

    this.passwordConfirm = undefined;
    next()
    })
   
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
   return await bcrypt.compare(candidatePassword, userPassword)
}    

  //Once password is changed making token invalid
  userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamap = parseInt(this.passwordChangedAt.getTime() / 1000, 10); //formatting the timestamp well dicided by 1000 and base 10
        console.log(this.passwordChangedAt, JWTTimestamp)
        return JWTTimestamp < changedTimestamap //if the time the JWT token was issued is less than the changeTimestamp then we changed the password after the JWT was issued so this logic is correct else return falseij
    }
    return false
  }

  userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });
   

const User = mongoose.model("User", userSchema)
module.exports = User;