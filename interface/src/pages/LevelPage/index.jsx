import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNao } from '../../contexts/NaoContext';
import { useGame } from '../../contexts/GameContext';
import {
    Container,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@mui/material';

export default function LevelPage() {
    const navigate = useNavigate();
    const { isConnected } = useNao();
    const { level, setLevel, micSource, setMicSource, audioOutput, setAudioOutput } = useGame();

    const handleStartGame = async () => {
        const API_URL = import.meta.env.VITE_BACKEND_URL;
        try {
            await axios.post(`${API_URL}/game/level`, null, { params: { level: `${level}_ano` } });
            await axios.post(`${API_URL}/game/mic-source`, null, { params: { source: micSource } });
            await axios.post(`${API_URL}/game/audio-output`, null, { params: { output: audioOutput } });
            await axios.post(`${API_URL}/game/start`);
            navigate('/game');
        } catch (error) {
            console.error('Erro ao iniciar o jogo:', error);
        }
    };

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Typography variant="h2" component="h2" gutterBottom>
                Configurações do Jogo
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
                <FormControl>
                    <InputLabel id="level-label">Ano Escolar</InputLabel>
                    <Select
                        labelId="level-label"
                        id="level"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        label="Ano Escolar"
                    >
                        <MenuItem value="1">1º Ano</MenuItem>
                        <MenuItem value="2">2º Ano</MenuItem>
                        <MenuItem value="3">3º Ano</MenuItem>
                        <MenuItem value="4">4º Ano</MenuItem>
                        <MenuItem value="5">5º Ano</MenuItem>
                        <MenuItem value="6">6º Ano</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="mic-source-label">Fonte do Microfone</InputLabel>
                    <Select
                        labelId="mic-source-label"
                        id="mic-source"
                        value={micSource}
                        onChange={(e) => setMicSource(e.target.value)}
                        label="Fonte do Microfone"
                    >
                        <MenuItem value="pc">PC</MenuItem>
                        <MenuItem value="nao">NAO</MenuItem>
                        <MenuItem value="hibrido">Híbrido</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="audio-output-label">Saída de Áudio</InputLabel>
                    <Select
                        labelId="audio-output-label"
                        id="audio-output"
                        value={audioOutput}
                        onChange={(e) => setAudioOutput(e.target.value)}
                        label="Saída de Áudio"
                    >
                        <MenuItem value="sistema">Sistema</MenuItem>
                        <MenuItem value="nao">NAO</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Button variant="contained" color="primary" size="large" onClick={handleStartGame}>
                Começar a Jogar
            </Button>
        </Container>
    );
}