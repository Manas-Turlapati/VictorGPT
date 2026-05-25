
# VectorGPT 🤖

A full-stack ChatGPT clone built with React, Node.js, Express, and MongoDB.

## Features
- 💬 Chat with AI powered by OpenAI API
- 🗂️ Thread management — create, view, and delete conversations
- 📝 Conversation history persisted in MongoDB
- ⚡ Real-time responses
- 🎨 Clean dark UI inspired by ChatGPT

## Tech Stack

**Frontend**
- React.js
- Context API for state management
- React Markdown + Highlight.js for code rendering
- FontAwesome icons

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- OpenAI API

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- OpenAI API key

### Installation

**Clone the repo**
```bash
git clone https://github.com/Manas-Turlapati/VectorGPT.git
cd VectorGPT
```

**Setup Backend**
```bash
cd Backend
npm install
```

Create a `.env` file in Backend/:
```
OPENAI_API_KEY=your_openai_api_key
MONGO_URI=your_mongodb_connection_string
PORT=8080
```

```bash
node server.js
```

**Setup Frontend**
```bash
cd Frontend
npm install
npm run dev
```

## Screenshots
Coming soon

## Author
Made with ❤️ by Manas Turlapati
