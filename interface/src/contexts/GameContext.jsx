import { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
    const [level, setLevel] = useState('1');
    const [micSource, setMicSource] = useState('pc');
    const [audioOutput, setAudioOutput] = useState('sistema');

    return (
        <GameContext.Provider value={{ level, setLevel, micSource, setMicSource, audioOutput, setAudioOutput }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
