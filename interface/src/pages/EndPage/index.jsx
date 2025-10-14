import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const API_URL = 'http://localhost:8000';

export default function EndPage() {
    const [finalState, setFinalState] = useState(null);

    useEffect(() => {
        const fetchFinalState = async () => {
            try {
                const response = await axios.get(`${API_URL}/game/state`);
                setFinalState(response.data);
            } catch (error) {
                console.error('Erro ao buscar o estado final do jogo:', error);
            }
        };

        fetchFinalState();
    }, []);

    if (!finalState) {
        return <div>Carregando resultados...</div>;
    }

    return (
        <div className="end-container">
            <h1 className="end-title">Fim de Jogo!</h1>
            <div className="final-score">
                <h2>Sua Pontuação Final</h2>
                <p>Acertos: {finalState.pontuacao.acertos}</p>
                <p>Erros: {finalState.pontuacao.erros}</p>
            </div>
            <Link to="/start" className="play-again-button">Jogar Novamente</Link>
        </div>
    );
}
