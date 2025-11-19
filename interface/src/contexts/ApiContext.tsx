import { createContext, useState, useContext, ReactNode, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const WS_URL = import.meta.env.VITE_BACKEND_URL.replace('http', 'ws');

interface GameState {
  palavra_atual: string;
  soletracao_usuario: string;
  nivel_atual: string;
  fonte_microfone: string;
  saida_audio: string;
  escutando: boolean;
  jogo_iniciado: boolean;
  erro: string | null;
  nao_conectado: boolean;
  pontuacao: {
    acertos: number;
    erros: number;
  };
  fim_de_jogo?: boolean;
  resultado_rodada?: 'acertou' | 'errou';
}

interface ApiContextType {
  gameState: GameState | null;
  startGame: () => Promise<void>;
  nextRound: () => Promise<void>;
  spell: () => Promise<void>;
  stopSpelling: () => Promise<void>;
  checkSpelling: () => Promise<void>;
  backspace: () => Promise<void>;
  setLevel: (level: string) => Promise<void>;
  setMicSource: (source: string) => Promise<void>;
  setAudioOutput: (output: string) => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(`${WS_URL}/ws/game`);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        fetchGameState();
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setGameState(data);
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected, reconnecting...");
        setTimeout(connect, 1000); // Reconnect after 1 second
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.current?.close();
      };
    };

    connect();

    return () => {
      ws.current?.close();
    };
  }, []);

  const fetchGameState = async () => {
    try {
      const response = await axios.get(`${API_URL}/game/state`);
      setGameState(response.data);
    } catch (error) {
      console.error('Erro ao buscar o estado do jogo:', error);
    }
  };

  const apiCall = async (endpoint: string, method: 'get' | 'post' = 'post', params: any = {}) => {
    try {
      const response = await axios[method](`${API_URL}${endpoint}`, null, { params });
      // The game state will be updated via WebSocket, but we can fetch it here for immediate feedback if needed.
      // For now, we rely on the WebSocket broadcast.
      return response.data;
    } catch (error) {
      console.error(`Erro ao chamar ${endpoint}:`, error);
      // Optionally update the state with an error message
    }
  };

  const startGame = () => apiCall('/game/start');
  const nextRound = () => apiCall('/game/next-round');
  const spell = () => apiCall('/game/spell');
  const stopSpelling = () => apiCall('/game/stop-spelling');
  const checkSpelling = () => apiCall('/game/check');
  const backspace = () => apiCall('/game/backspace');
  const setLevel = (level: string) => apiCall('/game/level', 'post', { level });
  const setMicSource = (source: string) => apiCall('/game/mic-source', 'post', { source });
  const setAudioOutput = (output: string) => apiCall('/game/audio-output', 'post', { output });

  return (
    <ApiContext.Provider
      value={{
        gameState,
        startGame,
        nextRound,
        spell,
        stopSpelling,
        checkSpelling,
        backspace,
        setLevel,
        setMicSource,
        setAudioOutput,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApi(): ApiContextType {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}
