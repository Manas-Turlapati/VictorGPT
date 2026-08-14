import { createRoot } from 'react-dom/client'
import { Toaster } from "react-hot-toast";

window.onerror = function(msg, url, lineNo, columnNo, error) {
  document.body.innerHTML = `<div style="color:red;font-size:20px;padding:20px;background:black;z-index:9999;position:fixed;top:0;left:0;width:100%;height:100%;">Error: ${msg}<br/>Line: ${lineNo}<br/>URL: ${url}</div>`;
};

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
