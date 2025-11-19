import { useApi } from "./contexts/ApiContext";
import { LandingPage } from "./components/LandingPage";
import { StartPage } from "./components/StartPage";
import { LevelPage } from "./components/LevelPage";
import { GamePage } from "./components/GamePage";
import { EndPage } from "./components/EndPage";
import { useState } from "react";

export default function App() {
  const { gameState } = useApi();
  const [screen, setScreen] = useState<'landing' | 'start' | 'level' | 'game' | 'end'>('landing');

  const handleStart = () => {
    setScreen('start');
  }

  const handleStartGame = () => {
    setScreen('level');
  }

  const handlePlayAgain = () => {
    setScreen('start');
  }

  if (gameState?.fim_de_jogo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB]">
        <EndPage onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  if (gameState?.jogo_iniciado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB]">
        <GamePage />
      </div>
    );
  }

  if (screen === 'level') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB]">
        <LevelPage />
      </div>
    );
  }
  
  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB]">
        <StartPage onStartGame={handleStartGame} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB]">
      <LandingPage onStart={handleStart} />
    </div>
  );
}