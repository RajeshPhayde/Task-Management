const {Schema, model} = require('mongoose');
const bcryptjs = require('bcryptjs');

let UserSchema = new Schema({
    name:{
        type: String,
        required : [true, "Name is Mandatory"]
    },
    role:{
        type: String,
        required: true,
        enum : {
            values : ["user", "admin"],
            message: "role can be user, admin allowed and you entered {VALUE}"
        }
    },
    email:{
        type: String,
        required : true
    },
    password:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        default:null
    },
    profile:{
        type: String,
        default:null
    }
},{
    timestamps : true
})

UserSchema.pre("save", async function(next){
    let salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
})

UserSchema.methods.compareMyPassword = async function(password){
    let hashedPassword = await bcryptjs.compare(password, this.password)
    return hashedPassword;
}

module.exports = new model("users", UserSchema)