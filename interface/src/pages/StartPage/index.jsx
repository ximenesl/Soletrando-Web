import { useNavigate } from 'react-router-dom';
import './style.css';

export default function StartPage() {
    const navigate = useNavigate();

    const handleStartGame = () => {
        navigate('/level');
    };

    return (
        <div className="start-container">
            <h1 className="start-title">Soletrando</h1>
            <button onClick={handleStartGame} className="start-game-button">Iniciar Jogo</button>
        </div>
    );
}