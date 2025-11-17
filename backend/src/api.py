"""Arquivo principal da API do Soletrando."""
import asyncio
import json
import queue
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from game.gerenciador_jogo import GerenciadorJogo

app = FastAPI(
    title="Soletrando com NAO - API",
    description="API para gerenciar o jogo Soletrando, com integração ao robô NAO.",
    version="1.0.0"
)

# --- Configuração do CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, restrinja para o domínio do front-end
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Gerenciador de Conexões WebSocket ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# --- Singleton do Gerenciador do Jogo ---
game_manager = GerenciadorJogo()

# --- WebSocket para atualizações em tempo real ---
@app.websocket("/ws/game")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Apenas para manter a conexão viva
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Cliente WebSocket desconectado")

async def broadcast_state():
    """Esta função será chamada para enviar o estado atual para todos os clientes"""
    state = game_manager.obter_estado()
    await manager.broadcast(json.dumps(state))

async def process_queue():
    while True:
        try:
            # Usamos to_thread para não bloquear o event loop
            soletracao = await asyncio.to_thread(game_manager.queue.get)
            await broadcast_state()
            game_manager.queue.task_done()
        except queue.Empty:
            await asyncio.sleep(0.1)

@app.on_event("startup")
async def startup_event():
    # Inicia a tarefa de processamento da fila em segundo plano
    asyncio.create_task(process_queue())


# --- Endpoints da API ---

@app.post("/game/start", tags=["Game"])
async def start_game():
    return game_manager.iniciar_jogo()

@app.post("/game/next-round", tags=["Game"])
async def next_round():
    return game_manager.iniciar_nova_rodada()

@app.post("/game/spell", tags=["Game"])
async def spell(device: str | int | None = None):
    return game_manager.iniciar_soletracao(device)

@app.post("/game/stop-spelling", tags=["Game"])
async def stop_spelling():
    return game_manager.parar_escuta_voz()

@app.post("/game/check", tags=["Game"])
async def check_spelling():
    return game_manager.verificar_soletracao()

@app.post("/game/backspace", tags=["Game"])
async def backspace():
    return game_manager.apagar_ultima_letra()

@app.post("/game/level", tags=["Game"])
async def set_level(level: str):
    return game_manager.definir_nivel(level)

@app.post("/game/mic-source", tags=["Game"])
async def set_mic_source(source: str):
    return game_manager.definir_fonte_microfone(source)

@app.post("/game/audio-output", tags=["Game"])
async def set_audio_output(output: str):
    return game_manager.definir_saida_audio(output)

@app.get("/game/state", tags=["Game"])
async def get_state():
    return game_manager.obter_estado()

# --- Endpoints do NAO ---

@app.post("/nao/connect", tags=["NAO"])
async def connect_nao(ip: str):
    return game_manager.conectar_nao(ip)

@app.post("/nao/disconnect", tags=["NAO"])
async def disconnect_nao():
    return game_manager.desconectar_nao()

# --- Para executar a API localmente ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
