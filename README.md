# VictorGPT 🤖

An AI-powered voice chat application built with React and Node.js.

## Live Demo
[victor-gpt-smoky.vercel.app](https://victor-gpt-smoky.vercel.app)

## Features
- 💬 AI chat powered by Meta's LLaMA3 via Groq API
- 🎤 Voice to text transcription using Groq Whisper
- 🔐 JWT authentication
- 📝 Chat thread history with CRUD operations
- 📱 Responsive design

## Tech Stack
**Frontend:** React, React Router, Context API, react-markdown  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**Auth:** JWT  
**AI:** Groq API (LLaMA3 70B + Whisper)  
**Storage:** Cloudinary, Multer  
**Deployment:** Vercel (frontend), Render (backend)

## Setup
1. Clone the repo
2. Backend: `cd Backend && npm install && npm start`
3. Frontend: `cd Frontend && npm install && npm run dev`
4. Add `.env` files (see below)

## Environment Variables
**Backend:**
ATLASDB_URL, JWT_SECRET, GROQ_API_KEY
**Frontend:**
VITE_BACKEND_URL



## Screenshots:
<img width="930" height="907" alt="image" src="https://github.com/user-attachments/assets/be013d8b-6494-4129-a0d2-a681318ac7a8" />
<img width="931" height="906" alt="image" src="https://github.com/user-attachments/assets/9aa5ac4f-48e0-44f2-bbb5-378aa1b171e5" />
<img width="928" height="907" alt="image" src="https://github.com/user-attachments/assets/bf481abd-50ca-4688-bc0a-754a0ab146c5" />

