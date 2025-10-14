
import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NaoContext = createContext();

export function NaoProvider({ children }) {
  const [naoIp, setNaoIp] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const connectToNao = async (ip) => {
    if (!ip) {
      toast.error('Por favor, insira o endereço de IP do robô.');
      return;
    }
    try {
      // We assume a successful connection if this request succeeds.
      // This endpoint should exist on the Python backend.
      await axios.post(`${backendUrl}/nao/connect?ip=${ip}`);
      setNaoIp(ip);
      setIsConnected(true);
      toast.success('Conectado ao robô NAO com sucesso!');
    } catch (error) {
      toast.error('Falha ao conectar com o robô NAO. Verifique o IP e se o servidor está rodando.');
      setIsConnected(false);
    }
  };

  return (
    <NaoContext.Provider value={{ naoIp, setNaoIp, isConnected, connectToNao }}>
      {children}
    </NaoContext.Provider>
  );
}

export function useNao() {
  return useContext(NaoContext);
}
