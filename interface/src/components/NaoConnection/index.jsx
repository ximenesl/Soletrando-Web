import { useState } from 'react';
import { useNao } from '../../contexts/NaoContext';
import { Box, Typography, TextField, Button } from '@mui/material';

export default function NaoConnection() {
  const [ip, setIp] = useState('');
  const { connectToNao, isConnected } = useNao();

  const handleConnect = () => {
    connectToNao(ip);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        width: 300,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        Conexão com o Robô NAO
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Digite o IP do robô"
          variant="outlined"
          size="small"
          fullWidth
        />
        <Button onClick={handleConnect} variant="contained">
          Conectar
        </Button>
      </Box>
      <Typography variant="body2" align="center">
        Status: {isConnected ? (
          <Typography component="span" color="success.main" fontWeight="bold">
            Conectado
          </Typography>
        ) : (
          <Typography component="span" color="error.main" fontWeight="bold">
            Desconectado
          </Typography>
        )}
      </Typography>
    </Box>
  );
}
