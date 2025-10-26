import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Breathing from "./Breathing";
import Layout from "./Layout.jsx";
import Grounding from "./Grounding";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/breathing" element={<Breathing />} />
          <Route path="/grounding" element={<Grounding />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
