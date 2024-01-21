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
                values : ["high", "medium", "low"],
                message: "priority must be high, medium or low you entered {value}"
            }
        }
    },
    {
        timestamps:true
    }
)

module.exports = new model("tasks", TaskSchema)