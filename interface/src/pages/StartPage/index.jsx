import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

export default function StartPage() {
    const navigate = useNavigate();

    const handleStartGame = () => {
        navigate('/level');
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
            <Typography variant="h1" component="h1" gutterBottom>
                Soletrando
            </Typography>
            <Button onClick={handleStartGame} variant="contained" color="primary" size="large">
                Iniciar Jogo
            </Button>
        </Container>
    );
}