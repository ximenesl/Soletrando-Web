import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NaoProvider } from './contexts/NaoContext';
import NaoConnection from './components/NaoConnection';
import './index.css';
import LandingPage from './pages/LandingPage';
import StartPage from './pages/StartPage';
import LevelPage from './pages/LevelPage';
import GamePage from './pages/GamePage';
import EndPage from './pages/EndPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NaoProvider>
      <Router>
        <Toaster position="top-center" />
        <NaoConnection />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/level" element={<LevelPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/end" element={<EndPage />} />
        </Routes>
      </Router>
    </NaoProvider>
  </StrictMode>,
)
