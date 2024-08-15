const User = require("../models/authModel");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const { promisify } = require("util");
const Email = require("../utils/email");
const jwt = require("jsonwebtoken");
//const _ = require("underscore")
const _ = require("lodash");
const crypto = require("crypto");
const sendEmail = require("../utils/email")
const { emailService, tokenService } = require("../services");
const httpStatus = require("http-status");
const bcrypt = require("bcryptjs")
const { validateRegister } = require("../validator/registerValidation")

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h"   // 24 hours
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
 res.status(statusCode).json({
       status: "success",
       token,
       data: {
           user
        
        }
    })
}

const token = tokenService.generateVerifyEmailToken();
const resetToken = tokenService.generateVerifyEmailToken();

//const emailToken = Math.floor(Math.random() * 98776) + 10000;

exports.signUp = catchAsync (async(req, res, next)=> {
    const { error, value } = validateRegister(req.body);
if (error) {
    console.log(error)
    return next(new AppError(error.details, 400));
}
    console.log("Token:", token)
    //_.extend(req.body, {confirmEmailToken: token})
    //console.log("TEST>>",_.extend(req.body,{confirmEmailToken: token}))
    const { email } = req.body;
    const checkEmail = await User.findOne({ email })
    // if (checkEmail) {
    //     return res.status(httpStatus.BAD_REQUEST).json({
    //         message: "Email already exists"
    //     })
    // } 
    if (checkEmail) {
    return next(new AppError('User already Exists with the email', 400)) 
}
    console.log("USER",value)
   
    const newUser = await User.create(value);
    await emailService.sendVerificationEmail(newUser.email, token);
     newUser.confirmEmailToken = token
     await newUser.save({ validateBeforeSave: false }) 
     createSendToken(newUser, 201, res)
})

exports.verifyEmail = catchAsync( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if(!user) {
        return next(new AppError('User not found signup and verify', 404))
    }
    if(user.isVerified === true) {
        return next(new AppError('User already verified you can Login now', 400))
    }
    if(!(+req.body.confirmEmailToken === user.confirmEmailToken)) {
        console.log(user)
        console.log("TOKEN",user.confirmEmailToken)
        return next(new AppError('You have entered a wrong token please try again later!', 400))
    }
    user.confirmEmailToken = undefined;
    user.confirmEmail = true
    user.isVerified = true;
    await user.save({ validateBeforeSave: false })    
   createSendToken(user, 201, res)
})

exports.login = catchAsync (async(req, res, next)=> {
    const { email, password } = req.body;
    if(!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if(!user ||!(await user.correctPassword(password, user.password))) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message:"Invalid email or password"
        
    });
    }
    if(!user.isVerified === true ) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message:"User not verified yet***",
    })
}
    createSendToken(user, 200, res)
})

exports.protect = catchAsync( async (req, res, next)  => {
       let token; 
    if ( req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")) {
             token = req.headers.authorization.split(" ")[1];// we re-assing this value to the token
        }
        if(!token) {
            return next(new AppError("You are not logged in! Please log in to get Access.", 401))
        }
    // 2) Verificaion token 
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    
        //3) chech if user still exists using the ID in the payload
        const currentUser = await User.findById(decoded.id);
        if(!currentUser) { 
            return next(new AppError("The User belonging to this token no longer exist", 401))
        }
    
       // 4) Check if user changed password after the token was issued!
       if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed password! Please log in again.", 401))
       }
    
       req.user = currentUser
         next()
    }) ;


exports.forgotPassword = catchAsync( async (req, res, next) => {
     const user =  await User.findOne({ email:req.body.email });
    if(!user) {
        return next(new AppError("There is no user with this email address.", 404))
    
    }

    
    //3) Send it to user's email   
try {
    const resetUrl = `${req.protocol}://${req.get("host")}
    /api/user/resetPassword/${resetToken}`;
    //await new Email(user, resetToken).sendPasswordReset();
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email`;
     await emailService.sendResetPasswordEmail(user.email, resetToken);
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email'
      });
}
   catch(err) {
    user.passwordResetToken = resetToken
    user.passwordResetExpires = undefined;
    console.log("RESET TKEN", user.passwordResetToken)
    await user.save({ validateBeforeSave: false })

    return next(new AppError('There was an Error sending the Email, Try again later'),
    500
     )
   }
    });
    
    exports.resetPassword = catchAsync(async (req, res, next) => {
        const user = await User.findOne({email: req.body.email }); //checking to see if token hasnt expire
    // 2) If token has not expired, and there is user, set the new password
            if(!user) { 
                return next(new AppError('User not Found', 400))
            }
            if(!user.passwordResetToken === resetToken){
                return next(new AppError('Invalid Token', 400)) 
            }
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            // const savedUser = await user.save()
            await user.save()
            
    //4) Log the user in, sendJWT
    createSendToken(user, 200, res)
});

    exports.updatePassword = catchAsync(async (req, res, next) => {
        // 1) Get user from collection
        const user = await User.findById(req.user.id).select('+password');
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
       await user.save();
        // User.findByIdAndUpdate will NOT work as intended!
      
        // 4) Log user in, send JWT
        createSendToken(user, 200, res)
      });