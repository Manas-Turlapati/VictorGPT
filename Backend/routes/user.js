const Thread = require("../models/thread.js");
const User = require("../models/user.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/auth/register",async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const existingUser = await User.findOne({username:username});
        if(!existingUser){
            const hashedPassword = await bcrypt.hash(password,10);
            let newUser = await User.create({
                username:username,
                password:hashedPassword,
                email:email
            });
            res.json({msg:"User has been added Successfully!"});
        }else{
            return res.status(400).json({ msg: "User already exists!" });
        }
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }   
})
router.post("/auth/login",async(req,res)=>{
    try{
        const {username,password} = req.body;
        const existingUser = await User.findOne({username:username});
        if(!existingUser){
            return res.status(400).json({ msg: "User doesn't exist" });
        }else{
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if(!isMatch){
                return res.status(400).json({ msg: "Invalid password" });
            }
            //generate the token and send it to the backend using jwt.sign and secret key 
            const token = jwt.sign(
              { id: existingUser._id, username: existingUser.username },
              process.env.JWT_SECRET,
              { expiresIn: "7d" },
            );
            res.json({ token, username: existingUser.username });
            
        }
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
})
module.exports = router;