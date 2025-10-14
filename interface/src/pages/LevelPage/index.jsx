import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNao } from '../../contexts/NaoContext';
import './style.css';

export default function LevelPage() {
    const [level, setLevel] = useState('1');
    const [micSource, setMicSource] = useState('pc');
    const navigate = useNavigate();
    const { isConnected, naoIp } = useNao();

    const handleStartGame = async () => {
        const API_URL = isConnected ? `http://${naoIp}:8000` : 'http://localhost:8000';
        try {
            await axios.post(`${API_URL}/game/level`, null, { params: { level: `${level}_ano` } });
            await axios.post(`${API_URL}/game/mic-source`, null, { params: { source: micSource } });
            await axios.post(`${API_URL}/game/start`);
            navigate('/game');
        } catch (error) {
            console.error('Erro ao iniciar o jogo:', error);
        }
    };

    return (
        <div className="level-container">
            <h2 className="level-title">Configurações do Jogo</h2>
            <div className="settings-container">
                <div className="setting-item">
                    <label htmlFor="level">Ano Escolar:</label>
                    <select id="level" value={level} onChange={(e) => setLevel(e.target.value)}>
                        <option value="1">1º Ano</option>
                        <option value="2">2º Ano</option>
                        <option value="3">3º Ano</option>
                        <option value="4">4º Ano</option>
                        <option value="5">5º Ano</option>
                        <option value="6">6º Ano</option>
                    </select>
                </div>
                <div className="setting-item">
                    <label htmlFor="mic-source">Fonte do Microfone:</label>
                    <select id="mic-source" value={micSource} onChange={(e) => setMicSource(e.target.value)}>
                        <option value="pc">PC</option>
                        <option value="nao">NAO</option>
                        <option value="hibrido">Híbrido</option>
                    </select>
                </div>
            </div>
            <button className="start-game-button" onClick={handleStartGame}>Começar a Jogar</button>
        </div>
    );
}