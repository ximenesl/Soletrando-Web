import { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

interface NaoContextType {
  naoIp: string;
  setNaoIp: (ip: string) => void;
  isConnected: boolean;
  isConnecting: boolean;
  connectToNao: () => Promise<void>;
  disconnectFromNao: () => Promise<void>;
}

const NaoContext = createContext<NaoContextType | undefined>(undefined);

export function NaoProvider({ children }: { children: ReactNode }) {
  const [naoIp, setNaoIp] = useState("192.168.0.100");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectToNao = async () => {
    setIsConnecting(true);
    try {
      const response = await axios.post(`${API_URL}/nao/connect`, null, {
        params: { ip: naoIp },
      });
      if (response.data.status === "conectado") {
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Erro ao conectar com o NAO:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromNao = async () => {
    try {
      await axios.post(`${API_URL}/nao/disconnect`);
      setIsConnected(false);
    } catch (error) {
      console.error("Erro ao desconectar do NAO:", error);
    }
  };

  return (
    <NaoContext.Provider
      value={{
        naoIp,
        setNaoIp,
        isConnected,
        isConnecting,
        connectToNao,
        disconnectFromNao,
      }}
    >
      {children}
    </NaoContext.Provider>
  );
}

export function useNao(): NaoContextType {
  const context = useContext(NaoContext);
  if (context === undefined) {
    throw new Error("useNao must be used within a NaoProvider");
  }
  return context;
}
