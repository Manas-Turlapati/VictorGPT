const Thread = require("../models/thread.js");
const express = require("express");
const router = express.Router();
const { getGrokResponse } = require("../utils/grokai.js");
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    if (!threads) return res.status(404).json({ error: "No threads found" });
    res.json({ success: true, data: threads });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  try {
    const tId = req.params.threadId;
    const thread = await Thread.findOne({ threadId: tId });
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    res.json({ success: true, data: thread });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  try {
    const tId = req.params.threadId;
    const deleted = await Thread.findOneAndDelete({ threadId: tId });
    if (!deleted) return res.status(404).json({ error: "Thread not found" });
    res.json({ success: true, message: "Thread has been deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/chat",async(req,res)=>{
    let {threadId,message} = req.body;
    try{
        let thread = await Thread.findOne({threadId:threadId});
        if(!thread){
            thread = new Thread({
                threadId : threadId,
                title:message,
                messages:[{role:"user",content:message}]
            })
        }else{
            thread.messages.push({
                role:"user",
                content:message
            })
        }
        let response = await getGrokResponse(message);
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