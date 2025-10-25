import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Breathing from "./Breathing";
import NavBar from "./NavBar";
import Grounding from "./Grounding";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/breathing" element={<Breathing />} />
        <Route path="/grounding" element={<Grounding />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
