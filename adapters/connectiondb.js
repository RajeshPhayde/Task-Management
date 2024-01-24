const {connect} = require('mongoose');
require('dotenv').config();

connect(process.env.PROD_MONGOURL)

.then(()=>{
    console.log("Mongodb connected succesfully")
})
.catch((err)=>{
    console.log(err)
})