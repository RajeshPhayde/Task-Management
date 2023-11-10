const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./adapters/connectiondb');
const UserRoutes = require('./routes/user.routes');
const TaskRoutes = require('./routes/task.routes');

let app = express();

app.use(express.json())
app.use(cors());
app.use(express.static("public"))

app.use("/api/user", UserRoutes )
app.use("/api/task", TaskRoutes )

app.use("*",(req, res, next)=>{
    res.status(404).json({error:true, message: "Page Not Found"})
})

//! error handling middleWare
app.use((err, req, res, next)=>{
    res.status(400).json({error:true, message:err.message, data:"Oops!!! You got an error buddy"})
})

app.listen(process.env.PORT, (err)=>{
    if(err) throw err
    console.log(`server is started in PORT: ${process.env.PORT}`)
})

//? run in cmd
//supervisor index.js 