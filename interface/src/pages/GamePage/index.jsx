import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNao } from '../../contexts/NaoContext';
import { useGame } from '../../contexts/GameContext';
import {
    Container,
    Typography,
    Button,
    Grid,
    Paper,
    CircularProgress,
    Box,
    IconButton,
} from '@mui/material';
import { VolumeUp } from '@mui/icons-material';

export default function GamePage() {
    const [gameState, setGameState] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();
    const ws = useRef(null);
    const { isConnected } = useNao();
    const { audioOutput } = useGame();

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const speakWord = (word) => {
        if (audioOutput === 'sistema' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'pt-BR';
            window.speechSynthesis.speak(utterance);
        }
    };

    const fetchGameState = async () => {
        try {
            const response = await axios.get(`${API_URL}/game/state`);
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

        const wsUrl = import.meta.env.VITE_BACKEND_URL.replace('http', 'ws') + '/ws/game';
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
    }, [navigate]);

    useEffect(() => {
        if (gameState && gameState.palavra_atual) {
            speakWord(gameState.palavra_atual);
        }
    }, [gameState?.palavra_atual]);

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
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            Rodada: {gameState.rodada_atual}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                Ouça a palavra:
                            </Typography>
                            <IconButton onClick={() => speakWord(gameState.palavra_atual)} color="primary">
                                <VolumeUp />
                            </IconButton>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            Você soletrou: <strong>{gameState.soletracao_usuario}</strong>
                        </Typography>

                        {gameState.resultado_rodada && (
                            <Box
                                sx={{
                                    my: 2,
                                    p: 2,
                                    borderRadius: 1,
                                    bgcolor: gameState.resultado_rodada === 'correto' ? 'success.main' : 'error.main',
                                    color: 'common.white',
                                }}
                            >
                                <Typography variant="h6">
                                    {gameState.resultado_rodada === 'correto' ? 'Você acertou!' : 'Você errou!'}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ mt: 3 }}>
                            {!isListening ? (
                                <Button onClick={handleSpell} variant="contained" disabled={gameState.resultado_rodada} sx={{ mr: 1 }}>
                                    Soletrar
                                </Button>
                            ) : (
                                <Button onClick={handleStopSpelling} variant="contained" color="secondary" sx={{ mr: 1 }}>
                                    Parar de Ouvir
                                </Button>
                            )}
                            <Button onClick={handleBackspace} variant="outlined" disabled={isListening || gameState.resultado_rodada} sx={{ mr: 1 }}>
                                Apagar
                            </Button>
                            <Button onClick={handleCheck} variant="outlined" disabled={isListening || gameState.resultado_rodada} sx={{ mr: 1 }}>
                                Verificar
                            </Button>
                            <Button onClick={handleNextRound} variant="contained" color="primary" disabled={!gameState.resultado_rodada}>
                                Próxima Rodada
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Pontuação
                        </Typography>
                        <Typography variant="body1">
                            Acertos: {gameState.pontuacao.acertos}
                        </Typography>
                        <Typography variant="body1">
                            Erros: {gameState.pontuacao.erros}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
