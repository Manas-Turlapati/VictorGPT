import { createRoot } from 'react-dom/client'
import { Toaster } from "react-hot-toast";
import './index.css'
import App from './App.jsx'
import Register from './Register.jsx'
import Login from './Login.jsx'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
createRoot(document.getElementById("root")).render(
  <>
    <Toaster position="top-center" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<App />} />
      </Routes>
    </BrowserRouter>
  </>,
);
