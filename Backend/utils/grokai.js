require("dotenv").config();
const fs = require("fs");
//grok api calling using docs
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function getGroqChatCompletion(userContent) {
  return groq.chat.completions.create({
    messages: userContent,
    model: "llama-3.3-70b-versatile",
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
      throw err;
    }
}
const getVoiceResponse = async(audio)=>{
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audio), // Required path to audio file - replace with your audio file!
      model: "whisper-large-v3-turbo", // Required model to use for transcription
      prompt: "Specify context or spelling", // Optional
      response_format: "json", // Optional
      language: "en", // Optional
      temperature: 0.0, // Optional
    });
    return transcription.text;
  } catch (err) {
    throw err;
  }
}
module.exports = { getGrokResponse,getVoiceResponse};