//requiring packages
const chatRouter= require("./routes/chat.js");
const userRouter = require("./routes/user.js");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { getGrokResponse }= require("./utils/grokai.js");
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(cors({ origin: "https://victor-gpt-smoky.vercel.app" }));
//connecting mongodb with the terminal 
let connectDB = async function(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongodb connected successfully");
    }
    catch(err){
        console.log(err);
    }
}
app.use("/api", chatRouter);
app.use("/api/auth",userRouter);
//connecting the port

app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}!!`);
    connectDB();
});

//post request for calling the open ai or grok api using grok api
// app.post("/test", async(req,res)=>{
//   try{
//     let reply = await getGrokResponse(req.body.content);
//     res.json({reply:reply});
//   }
//   catch(err){
//     console.log(err);
//   }
// });