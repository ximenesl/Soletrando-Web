import { Link } from 'react-router-dom';
import './style.css';

export default function LandingPage() {
    return (
        <div className="landing-container">
            <h1 className="landing-title">Soletrando Web</h1>
            <p className="landing-subtitle">Um jogo de soletração interativo com o robô NAO.</p>
            <div className="project-description">
                <p>Este projeto é um jogo de soletração onde os jogadores podem testar suas habilidades de soletração. A aplicação web se conecta a um backend Python que gerencia a lógica do jogo.</p>
                <p>Uma característica especial é a integração com o robô NAO, que pode ser usado como um microfone para a entrada de voz, proporcionando uma experiência mais interativa.</p>
            </div>
            <Link to="/start" className="start-button">Iniciar</Link>
        </div>
    );
}