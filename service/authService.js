const jwt = require('jsonwebtoken');
require('dotenv').config();

let auth = async (req, res, next)=>{
    try{
        //! recieving token from the front end
        let authToken = req.headers.authorization;
    console.log(authToken);

        if(!authToken || !authToken.startsWith("Bearer")){
            return res.status(500).json({error:true, message:`Token Required`})
        }

        //! getting the token without Bearer
        let token = authToken.split(" ")[1];

        let decodedData = jwt.verify(token, process.env.JWT_KEY)
        let {email, _id}= decodedData;

        req.user ={email, _id}
        next()

    }
    catch(err){
        next(err);
    }
}

module.exports = {auth}