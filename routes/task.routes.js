const express = require('express');
const {auth} = require('../service/authService');
const {addTask, getAllTasks, singleTasks, updateTask, userTask, deleteTask, taskCompleted} = require('../controller/task.controller');

let router = express.Router();

router.post("/addtask", auth, addTask)
router.get("/alltasks", getAllTasks)
router.get("/task/:id", singleTasks)
router.put("/updatetask/:id", updateTask)
router.get("/usertask", auth, userTask)
router.delete("/deletetask/:id", deleteTask)
router.put("/taskcompleted/:id", taskCompleted)

module.exports = router;