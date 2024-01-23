const User = require('../models/user.model');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Joi = require('joi');
const { invitationMailOTP } = require('../helpers/emailOtpHelper');
const otpGenerator = require('otp-generator');
const validator = require('email-validator');
// const emailValidator = require('node-email-verifier');
// some issues with the node-email-verifier

let userLogin = Joi.object({
    name: Joi.string().required().min(4).message({
        "string.base": "Name must be string",
        "string.min": "Name should contain min 4 characters",
        "string.empty": "Name is mandatory"
    }),
    email: Joi.string().required().email().messages({
        "string.base": "email must be a string",
        "string.empty": "email is mandatory"
    }),
    password: Joi.string().required().messages({
        "string.base": "password must be a string",
        "string.empty": "password is mandatory"
    })
})

let validateEmail = async (req, res, next)=>{
    try{
        let {email} = req.params;
        // console.log(email)
        let isValid = validator.validate(email);
        // let isValid = await emailValidator(email);
        console.log(isValid)
        if(!isValid){
            return res.status(400).json({error:true, message:`Please check your email and continue`})
        }
        return res.status(200).json({error:false, message:"Validation successfull", data:isValid})
    }
    catch(err){
        next(err);
    }
}
let registerUser = async (req, res, next) => {
    try {
        let { name, email, password, role } = req.body;
        let { value, error } = userLogin.validate({ name, email, password });
        console.log(req.body)

        if (error) {
            return res.status(400).json({ error: true, message: "Validation failed", data: error })
        }

        else {
            if(role==='admin'){
                let isAdminPresent = await User.findOne({role})
                if(isAdminPresent){
                    return res.status(500).json({error:true, message:"Admin already present...!!!"})
                }
            }

            let isAvailable = await User.findOne({ email })

            if (isAvailable) {
                return res.status(500).json({ error: true, message: "User data already available" })
            }

            let newUser = await User.create({ name, role, email, password })
            return res.status(201).json({ error: false, message: `${newUser.name}'s data added successfully`, data: newUser })
        }

    }
    catch (err) {
        next(err)
    }
}

let loginUser = async (req, res, next) => {
    try {
        let { email, password } = req.body
        let isUserAvailable = await User.findOne({ email });

        if (!isUserAvailable) {
            return res.status(404).json({ error: true, message: `User Not Found with given email ${email}` })
        }

        let hashedPassword = await isUserAvailable.compareMyPassword(password)
        if (hashedPassword) {

            let token = jwt.sign({
                email: isUserAvailable.email,
                _id: isUserAvailable._id
            }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRESIN })
            return res.status(200).json({ error: false, message: "Login Successfull", token })
        }
        else {
            return res.status(401).json({ error: true, message: "Invalid Password !!!" })
        }
    }
    catch (err) {
        next(err)
    }
}

let sendOtp = async (req, res, next) => {
    try {
        let { email } = req.body;
        let isAvailable = await User.findOne({ email })
        if (!isAvailable) {
            return res.status(404).json({ error: true, message: `user not found with email ${email}` })
        }
        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false, specialChars: false })
        invitationMailOTP(email, otp);
        let updatedUser = await User.findOneAndUpdate({ email }, { otp }, { new: true })
        return res.status(201).json({ error: false, message: `Otp sent to ${email}`})
    }
    catch (err) {
        next(err);
    }
}

let verifyOtp = async (req, res, next) => {
    try {
        let { email, otp } = req.body;
        let isAvailable = await User.findOne({ email })
        if (!isAvailable) {
            return res.status(404).json({ error: true, message: `user not registered with email ${email}` })
        }
        if (otp === isAvailable.otp) {
            let token = jwt.sign({
                email: isAvailable.email,
                _id: isAvailable._id
            }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRESIN })
            return res.status(200).json({ error: false, message: "Login succesfull", token })
        }
        return res.status(400).json({ error: true, message: "Invalid Otp" })
    }
    catch (err) {
        next(err);
    }
}

//! do Reset password based on otp.
let resetPassword = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        let isAvailable = await User.findOne({ email })
        if (!isAvailable) {
            return res.status(404).json({ error: true, message: `user not found with email ${email}` })
        }
        let salt = await bcryptjs.genSalt(10);
        let hashedPassword = await bcryptjs.hash(password, salt);
        let updatedUser = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true })

        return res.status(200).json({ error: false, message: "Password updated succesfully, redirecting to Login", data: { email, name: updatedUser.name } })
    }
    catch (err) {
        next(err)
    }
}

let resetPasswordOTP = async(req, res, next) =>{
    try{
        let {email, password, otp} = req.body;

        let isAvailable = await User.findOne({email})
        if(!isAvailable){
            return res.status(404).json({error:true, message:`user not found with email ${email}`})
        }
        if(isAvailable.otp == otp){
            let salt = await bcryptjs.genSalt(10);
            let hashedPassword = await bcryptjs.hash(password, salt);
            let updatedUser = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true })

            return res.status(200).json({ error: false, message: "Password updated succesfully", data: { email, name: updatedUser.name } })
        }
        else{
            return res.status(404).json({error:true, message:`Invalid OTP`, data:{email, otp}})
        }
    }
    catch(err){
        next(err)
    }
}
let getSingleUser = async (req, res, next)=>{
    try{
        let {email, _id} = req.user;
        let isAvailable = await User.findById({_id})
        // console.log(isAvailable)
        return res.status(200).json({error:false, message:"User data available", data : isAvailable})
    }
    catch(err){
        next(err);
    }
}
let getAllUsers = async (req, res, next) => {
    try {
        let allUsers = await User.find();

        if (allUsers.length) {
            return res.status(200).json({ error: false, message: "Users data fetched succesfully", data: allUsers })
        }
        return res.status(404).json({ error: true, message: "Users not found!!!" })
    }
    catch (err) {
        next(err);
    }
}

//! check with api postman
let updateUser = async(req, res, next)=>{
    try{
        let {name, email} = req.body;
        // console.log(req.file);

        // let port = "http://localhost:5000";
        // // console.log(path);
        // let path = req.file.path.split("public")[1]
        // let imagePath = port + path;

        let isAvailable = await User.findOne({email})
        if(!isAvailable){
            return res.status(404).json({error:true, message:`user not found with email ${email}`});
        }
        let updatedUser = await User.findOneAndUpdate({_id:isAvailable._id},{name,email},{new:true})
        return res.status(200).json({error:false, message:`${updateUser.name}'s data updated successfully`, data:updatedUser})
    }
    catch(err){
        next(err);
    }
}

let editProfile = async(req, res, next)=>{
    try{
        let {email, _id} = req.user;
        console.log(email);
        console.log(req.file);
        let isAvailable = await User.findOne({email})
        if(!isAvailable){
            return res.status(404).json({error:true, message:`user not found with email ${email}`});
        }
        let updatedUser = await User.findOneAndUpdate({_id},{profile:req.file.filename},{new:true})
        return res.status(200).json({error:false,message:"Image uploaded succesfully", data: updatedUser})
    }
    catch(err){
        next(err);
    }
}

module.exports = { registerUser, loginUser, resetPassword, resetPasswordOTP,
    getAllUsers, getSingleUser, sendOtp,
     verifyOtp, updateUser, editProfile, validateEmail }