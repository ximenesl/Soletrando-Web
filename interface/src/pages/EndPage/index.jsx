import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    Paper,
    CircularProgress,
} from '@mui/material';

const API_URL = import.meta.env.VITE_BACKEND_URL;

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
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <Typography variant="h1" component="h1" gutterBottom>
                Fim de Jogo!
            </Typography>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Sua Pontuação Final
                </Typography>
                <Typography variant="h5">
                    Acertos: {finalState.pontuacao.acertos}
                </Typography>
                <Typography variant="h5">
                    Erros: {finalState.pontuacao.erros}
                </Typography>
            </Paper>
            <Button component={Link} to="/start" variant="contained" color="primary" size="large">
                Jogar Novamente
            </Button>
        </Container>
    );
}
