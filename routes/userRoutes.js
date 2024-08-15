const express = require("express");
const authController = require("../controller/authController")

const router = express.Router()

router.post("/signup", authController.signUp);
router.post("/verifyEmail",  authController.verifyEmail ); // 
router.post("/login", authController.login ); //authController.verifyToken 
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword", authController.resetPassword);
//we use this middleware to protect all the route below and it works coz middleware wroks in sequence(one after he othen m)
router.use(authController.protect)

router.patch("/updateMyPassword", authController.updatePassword);



module.exports = router


