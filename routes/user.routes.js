const express = require('express');
const {registerUser, loginUser, resetPassword, getAllUsers, sendOtp, verifyOtp, getSingleUser, updateUser, editProfile, validateEmail} = require('../controller/user.controller');
const multer = require('multer');
const { auth } = require('../service/authService');
const path = require('path');

let router = express.Router();

const myStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './public/uploads')
        // cb(error, destination to store image)
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname +"_"+ Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: myStorage})

router.post("/validatemail/:email", validateEmail)
router.post("/adduser", registerUser)
router.post("/userlogin", loginUser)
router.post("/resetpassword", resetPassword)
router.get("/singleuser",auth, getSingleUser)
router.get("/allusers", getAllUsers)
router.post("/otplogin", sendOtp)
router.post("/verifyuser", verifyOtp)
router.put("/updateuser", updateUser)
router.put("/editprofile", auth, upload.single('file'), editProfile)

module.exports = router;