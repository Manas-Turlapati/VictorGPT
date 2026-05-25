require("dotenv").config();
//grok api calling using docs
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function getGroqChatCompletion(userContent) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userContent,
      },
    ],
    model: "openai/gpt-oss-20b",
  });
}
const getGrokResponse = async(message)=>{
    try{
      let userContent = message;
      const chatCompletion = await getGroqChatCompletion(userContent);
      let reply = chatCompletion.choices[0].message.content;
      return reply;
    }
    catch(err){
      console.log(err);
    }
    
}
module.exports = { getGrokResponse };