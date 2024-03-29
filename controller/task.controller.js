const Task = require('../models/task.model');
require('dotenv').config();

let addTask = async(req, res, next)=>{
    try
    {
        let {userId,tName,description,dueDate,priority}=req.body;
        console.log(userId)
        userId=req.user._id;

        console.log(new Date(dueDate))
        console.log(new Date())
        console.log(new Date(dueDate) < new Date())
       
        if(new Date(dueDate) < new Date()){
            return res.status(400).json({error:true, message:"Due date should be greater than current date", data:req.body})
        }

        let newTask=await Task.create({userId,tName,description,dueDate,priority});

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
        console.log(tasks)

        // tasks.forEach( async element => {
        //     if(new Date(element.dueDate)<new Date()){
        //         console.log("Hoiko")
        //         let dTask = await Task.findOneAndDelete({_id:element._id})
        //         console.log(dTask)
        //     }
        // });

        //? let updatedTask = tasks.map(v =>{ return new Date(v.dueDate)<new Date()})
        //? console.log(updatedTask)

        tasks = await Task.find();
        console.log(tasks)

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
        console.log(id)
        let task = await Task.findOneAndDelete({_id:id})
        console.log(task)

        if(!task){
            return res.status(404).json({error:true, message:"Task not found !!!"})
        }
        // let deletedTask = await Task.findOneAndDelete({_id:id})
        // return res.status(200).json({error:false, message:"Task deleted successfully", data:deletedTask})
        return res.status(200).json({error:false, message:"Task deleted successfully"})
    }
    catch(err){
        next(err)
    }
}

let userTask = async(req, res, next)=>{
    try{
        console.log(req.user)
       let userId =req.user._id;
       console.log(userId)
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

let taskCompleted = async(req, res, next)=>{
    try{
        let {id}=req.params;
        let status = "Completed";
        let findTask = await Task.findById(id)
        if(!findTask){
            return res.status(404).json({error:true, message:"Task Unavailable"})
        }
        let updatedTask = await Task.findOneAndUpdate({_id:id},{status},{new:true})
        return res.status(200).json({error:false, message:"Task updated successfully", data:updatedTask})
    }
    catch(err){
        next(err)
    }
}

module.exports = {addTask, getAllTasks, singleTasks, updateTask, userTask, deleteTask,taskCompleted}