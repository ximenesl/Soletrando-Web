import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

export default function LandingPage() {
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
                Soletrando Web
            </Typography>
            <Typography variant="h5" component="p" color="textSecondary" paragraph>
                Um jogo de soletração interativo com o robô NAO.
            </Typography>
            <Box sx={{ maxWidth: 600, mb: 4 }}>
                <Typography variant="body1" color="textSecondary" align="center" paragraph>
                    Este projeto é um jogo de soletração onde os jogadores podem testar suas habilidades de soletração. A aplicação web se conecta a um backend Python que gerencia a lógica do jogo.
                </Typography>
                <Typography variant="body1" color="textSecondary" align="center" paragraph>
                    Uma característica especial é a integração com o robô NAO, que pode ser usado como um microfone para a entrada de voz, proporcionando uma experiência mais interativa.
                </Typography>
            </Box>
            <Button component={Link} to="/start" variant="contained" color="primary" size="large">
                Iniciar
            </Button>
        </Container>
    );
}