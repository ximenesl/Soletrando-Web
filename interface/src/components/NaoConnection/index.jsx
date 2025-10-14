import { useState } from 'react';
import { useNao } from '../../contexts/NaoContext';
import './style.css';

export default function NaoConnection() {
  const [ip, setIp] = useState('');
  const { connectToNao, isConnected } = useNao();

  const handleConnect = () => {
    connectToNao(ip);
  };

  return (
    <div className="nao-connection-container">
      <div className="nao-connection-box">
        <h3 className="nao-connection-title">Conexão com o Robô NAO</h3>
        <div className="nao-input-group">
          <input 
            type="text" 
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Digite o IP do robô" 
            className="nao-ip-input"
          />
          <button onClick={handleConnect} className="connect-button">
            Conectar
          </button>
        </div>
        <p className="connection-status">
          Status: {isConnected ? <span className="connected">Conectado</span> : <span className="disconnected">Desconectado</span>}
        </p>
      </div>
    </div>
  );
}
