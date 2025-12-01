"""Arquivo principal da API do Soletrando."""
import asyncio
import json
import queue
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from game.gerenciador_jogo import GerenciadorJogo

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicia a tarefa de processamento da fila em segundo plano
    task = asyncio.create_task(process_queue())
    print("Servidor iniciado, processador de fila no ar.")
    yield
    # Lógica de encerramento (se necessário)
    task.cancel()
    await task
    print("Servidor encerrado.")


app = FastAPI(
    title="Soletrando com NAO - API",
    description="API para gerenciar o jogo Soletrando, com integração ao robô NAO.",
    version="1.0.0",
    lifespan=lifespan
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
        except asyncio.CancelledError:
            print("Processador de fila cancelado.")
            break
        except queue.Empty:
            await asyncio.sleep(0.1)


# --- Endpoints da API ---

@app.post("/game/start", tags=["Game"])
async def start_game():
    response = game_manager.iniciar_jogo()
    await broadcast_state()
    return response

@app.post("/game/next-round", tags=["Game"])
async def next_round():
    response = game_manager.iniciar_nova_rodada()
    await broadcast_state()
    return response

@app.post("/game/spell", tags=["Game"])
async def spell(device: str | int | None = None):
    # A atualização aqui é feita pela queue no _adicionar_letra
    return game_manager.iniciar_soletracao(device)

@app.post("/game/stop-spelling", tags=["Game"])
async def stop_spelling():
    response = game_manager.parar_escuta_voz()
    await broadcast_state()
    return response

@app.post("/game/check", tags=["Game"])
async def check_spelling():
    response = game_manager.verificar_soletracao()
    await broadcast_state()
    return response

@app.post("/game/backspace", tags=["Game"])
async def backspace():
    response = game_manager.apagar_ultima_letra()
    await broadcast_state()
    return response

@app.post("/game/level", tags=["Game"])
async def set_level(level: str):
    response = game_manager.definir_nivel(level)
    await broadcast_state()
    return response

@app.post("/game/mic-source", tags=["Game"])
async def set_mic_source(source: str):
    response = game_manager.definir_fonte_microfone(source)
    await broadcast_state()
    return response

@app.post("/game/audio-output", tags=["Game"])
async def set_audio_output(output: str):
    response = game_manager.definir_saida_audio(output)
    await broadcast_state()
    return response

@app.get("/game/state", tags=["Game"])
async def get_state():
    return game_manager.obter_estado()

# --- Endpoints do NAO ---

@app.post("/nao/connect", tags=["NAO"])
async def connect_nao(ip: str):
    response = game_manager.conectar_nao(ip)
    await broadcast_state()
    return response

@app.post("/nao/disconnect", tags=["NAO"])
async def disconnect_nao():
    response = game_manager.desconectar_nao()
    await broadcast_state()
    return response

# --- Para executar a API localmente ---
if __name__ == "__main__":
    import uvicorn
    # Para que o reload funcione, o uvicorn precisa ser chamado com uma string
    # que aponta para a instância do app, em vez do objeto em si.
    uvicorn.run("api:app", host="0.0.0.0", port=8001, reload=True)
