import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNao } from '../../contexts/NaoContext';
import './style.css';

export default function GamePage() {
    const [gameState, setGameState] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();
    const ws = useRef(null);
    const { naoIp, isConnected } = useNao();

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const fetchGameState = async () => {
        try {
            const response = await axios.get(`${API_URL}/game/state`);
            console.log(response);
            setGameState(response.data);
            if (response.data.fim_de_jogo) {
                navigate('/end');
            }
        } catch (error) {
            console.error('Erro ao buscar o estado do jogo:', error);
        }
    };

    useEffect(() => {
        fetchGameState();

        const wsUrl = import.meta.env.VITE_BACKEND_URL;
        ws.current = new WebSocket(wsUrl);
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setGameState(data);
            if (data.fim_de_jogo) {
                navigate('/end');
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [isConnected, naoIp, navigate]);

    const handleSpell = async () => {
        try {
            await axios.post(`${API_URL}/game/spell`);
            setIsListening(true);
        } catch (error) {
            console.error('Erro ao iniciar a soletração:', error);
        }
    };

    const handleStopSpelling = async () => {
        try {
            await axios.post(`${API_URL}/game/stop-spelling`);
            setIsListening(false);
            fetchGameState(); // Atualiza o estado para mostrar a palavra soletrada
        } catch (error) {
            console.error('Erro ao parar a soletração:', error);
        }
    };

    const handleCheck = async () => {
        try {
            await axios.post(`${API_URL}/game/check`);
            fetchGameState();
        } catch (error) {
            console.error('Erro ao verificar a soletração:', error);
        }
    };

    const handleBackspace = async () => {
        try {
            await axios.post(`${API_URL}/game/backspace`);
            fetchGameState();
        } catch (error) {
            console.error('Erro ao apagar letra:', error);
        }
    };

    const handleNextRound = async () => {
        try {
            await axios.post(`${API_URL}/game/next-round`);
            fetchGameState();
        } catch (error) {
            console.error('Erro ao iniciar nova rodada:', error);
        }
    };

    if (!gameState) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="game-container">
            <div className="game-area">
                <h2>Rodada: {gameState.rodada_atual}</h2>
                <div className="word-to-spell">A palavra é: <strong>{gameState.palavra_atual}</strong></div>
                <div className="spelled-word">Você soletrou: <strong>{gameState.soletracao_usuario}</strong></div>

                {gameState.resultado_rodada && (
                    <div className={`result ${gameState.resultado_rodada === 'correto' ? 'correct' : 'incorrect'}`}>
                        {gameState.resultado_rodada === 'correto' ? 'Você acertou!' : 'Você errou!'}
                    </div>
                )}

                <div className="game-controls">
                    {!isListening ? (
                        <button onClick={handleSpell} disabled={gameState.resultado_rodada}>Soletrar</button>
                    ) : (
                        <button onClick={handleStopSpelling}>Parar de Ouvir</button>
                    )}
                    <button onClick={handleBackspace} disabled={isListening || gameState.resultado_rodada}>Apagar</button>
                    <button onClick={handleCheck} disabled={isListening || gameState.resultado_rodada}>Verificar</button>
                    <button onClick={handleNextRound} disabled={!gameState.resultado_rodada}>Próxima Rodada</button>
                </div>
            </div>

            <div className="score-area">
                <h3>Pontuação</h3>
                <p>Acertos: {gameState.pontuacao.acertos}</p>
                <p>Erros: {gameState.pontuacao.erros}</p>
            </div>
        </div>
    );
}
