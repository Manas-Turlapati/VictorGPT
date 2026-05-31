const Thread = require("../models/thread.js");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, Date.now() + "." + ext);
  },
});
const upload = multer({ storage });
const {verifyToken} = require("../middleware.js");
const router = express.Router();
const { getGrokResponse, getVoiceResponse } = require("../utils/grokai.js");
router.get("/thread", verifyToken,async (req, res) => {
  try {
    const threads = await Thread.find({user:req.user.id}).sort({ updatedAt: -1 });
    if (!threads) return res.status(404).json({ error: "No threads found" });
    res.json({ success: true, data: threads });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/thread/:threadId",verifyToken,async (req, res) => {
  try {
    const tId = req.params.threadId;
    const thread = await Thread.findOne({
      threadId: tId, // ← add this
      user: req.user.id, // ← keep this for security
    });
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    res.json({ success: true, data: thread });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/thread/:threadId",verifyToken, async (req, res) => {
  try {
    const tId = req.params.threadId;
    const deleted = await Thread.findOneAndDelete({ threadId: tId });
    if (!deleted) return res.status(404).json({ error: "Thread not found" });
    res.json({ success: true, message: "Thread has been deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/chat",verifyToken,async(req,res)=>{
    let {threadId,message} = req.body;
    try{
        let thread = await Thread.findOne({threadId:threadId});
        
        if(!thread){
            thread = new Thread({
                threadId : threadId,
                title:message,
                user:req.user.id,
                messages:[{role:"user",content:message}]
            })
        }else{
            thread.messages.push({
                role:"user",
                content:message
            })
        }
        let response = await getGrokResponse(thread.messages);
        thread.messages.push({ role: "assistant", content: response });
        thread.updatedAt = new Date();
        await thread.save();
        res.json({ reply: response });
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    }
})

router.post("/transcribe",verifyToken,upload.single("audio"),async(req,res)=>{
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }
    const audioFile = req.file.path;
    console.log(audioFile);
    const text = await getVoiceResponse(audioFile);
    //after transcription is done delete it
    fs.unlinkSync(audioFile);
    res.json({ success: true, transcript: text });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Transcription failed" });
  }
})
// router.post("/test",async(req,res)=>{
//     try{
//         const addItem = new Thread({
//             threadId:"xyx",
//             title:"manas"
//         })
//         await addItem.save();
//         res.send("data has been added!");
//     }
//     catch(err){
//         console.log(err);
//     }
// })
module.exports = router;
 