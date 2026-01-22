import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import './index.css'
import App from './App.tsx'
import Canvas from './game/Canvas'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
       <Routes>
      <Route path="/lobby" element={<App />} />
      <Route path="/room/:id" element={<Canvas />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
