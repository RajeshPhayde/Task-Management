const { date } = require('joi');
const {Schema, model} = require('mongoose');

let TaskSchema = new Schema(
    {
        userId:{
            type:String,
            required: true
        },
        tName:{
            type:String,
            required: [true, "Task name is mandatory"]
        },
        description:{
            type:String,
            required: true
        },
        dueDate:{
            type: String,
            required: true
        },
        priority:{
            type:String,
            required: true,
            enum:{
                values : ["high", "low"],
                message: "priority must be high or low you entered {value}"
            }
        },
        status:{
            type: String,
            default: "Pending"
        }
    },
    {
        timestamps:true
    }
)

module.exports = new model("tasks", TaskSchema)