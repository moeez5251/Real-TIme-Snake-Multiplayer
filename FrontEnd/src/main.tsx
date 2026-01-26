import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import './index.css'
import App from './App.tsx'
import Canvas from './game/Canvas'
import { SoundProvider } from './context/sound.tsx';
import Home from './components/Home.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SoundProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<App />} />
        <Route path="/room/:id" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
    </SoundProvider>
  </StrictMode>,
)
