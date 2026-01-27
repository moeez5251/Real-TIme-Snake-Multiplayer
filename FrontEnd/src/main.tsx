import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import Canvas from './game/Canvas'
import { SoundProvider } from './context/sound.tsx';
import Home from './components/Home.tsx';
import UserName from './components/usernameadd.tsx';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './src/routes/ProtectedRoute.tsx';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<UserName />} />
        <Route path="/lobby" element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        } />
        <Route path="/room/:id" element={<Canvas />} />
      </Routes>
    </AnimatePresence>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SoundProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </SoundProvider>
  </StrictMode>
);
