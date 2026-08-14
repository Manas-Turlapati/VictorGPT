const Thread = require("../models/thread.js");
const User = require("../models/user.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/register",async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const existingUsername = await User.findOne({username:username});
        const existingEmail = await User.findOne({email:email});
        if(existingUsername || existingEmail){
            return res.status(400).json({ msg: "User with this username or email already exists!" });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        let newUser = await User.create({
            username:username,
            password:hashedPassword,
            email:email
        });
        res.json({msg:"User has been added Successfully!"});
    }
    catch(err){
        console.error("Register Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }   
})
router.post("/login",async(req,res)=>{
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
        console.error("Login Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
module.exports = router;