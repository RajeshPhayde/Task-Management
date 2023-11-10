const Task = require('../models/task.model');
require('dotenv').config();

let addTask = async(req, res, next)=>{
    try
    {
        let {userId,tName,discription,dueDate,priority}=req.body;

        console.log("userId")
        userId=req.user._id;

        let newTask=await Task.create({userId,tName,discription,dueDate,priority});

        if(newTask)
        {
            return res.status(201).json({error:false,message:"Task Added Successfully",data:newTask})
        }
        return res.status(500).json({error:true,message:"invalid task",data:newTask})
    }
    catch(err){
        next(err)
    }
}

let getAllTasks = async(req, res, next)=>{
    try{
        let tasks = await Task.find();
        if(tasks.length){
            return res.status(200).json({error:false, message:"Task fetched succesfully", data:tasks})
        }
        return res.status(404).json({error:true, message:"No tasks available !!!"})
    }
    catch(err){
        next(err);
    }
}

let singleTasks = async (req, res, next)=>{
    try{
        let {id}=req.params;
        let task = await Task.findById(id)
        if(task){
            return res.status(200).json({error:false, message:"Task fetched successfully", data: task})
        }
        return res.status(404).json({error:true, message:"No task available!!!"})
    }
    catch(err){
        next(err);
    }
}

//! need to add all details from frontend
let updateTask =async (req, res, next)=>{
    try{
        let {id}=req.params;
        let {tName} = req.body;
        let task = await Task.findById(id)
        if(!task){
            return res.status(404).json({error:true, message:"Task not found !!!"})
        }
        let updatedTask = await Task.findOneAndUpdate({_id:id},{tName},{new:true})
        return res.status(200).json({error:false, message:"Task updated successfully", data:updatedTask})
    }
    catch(err){
        next(err)
    }
}

let deleteTask =async (req, res, next)=>{
    try{
        let {id}=req.params;
        let task = await Task.findById(id)
        if(!task){
            return res.status(404).json({error:true, message:"Task not found !!!"})
        }
        let deletedTask = await Task.findOneAndDelete({_id:id})
        return res.status(200).json({error:false, message:"Task deleted successfully", data:deletedTask})
    }
    catch(err){
        next(err)
    }
}

let userTask = async(req, res, next)=>{
    try{
       let userId =req.user._id;
       let tasks = await Task.find({userId})
       if(tasks.length){
        return res.status(200).json({error:false, message:"Tasks fetched successfully", data:tasks})
       }
       return res.status(404).json({error:true, message:"No task assigned!!!"})
    }
    catch(err){
        next(err)
    }
}

module.exports = {addTask, getAllTasks, singleTasks, updateTask, userTask, deleteTask}