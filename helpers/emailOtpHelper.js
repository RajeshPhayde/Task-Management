const nodemailer = require('nodemailer');


let invitationMailOTP = async (email, otp)=>{

    let transporter = nodemailer.createTransport({
        service : "Gmail",
        auth :{
            user : "ajnathahere@gmail.com",
            pass : "ulsvzbsvojtcifnt"
        }
    })

    transporter.sendMail({
        from : "ajnathahere@gmail.com",
        to : email,
        subject : "Invitation mail",
        html : `<div><h1 style="color : red;">Welcome buddy</h1><h2 style="color : blue;">Thanks for Registering... your Otp is ${otp}</h2></div>`
    }, ()=>{console.log("Mail sent successfully with OTP")})

}

module.exports = { invitationMailOTP }