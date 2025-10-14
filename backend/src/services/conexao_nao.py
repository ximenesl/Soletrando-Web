"""Módulo para reconhecimento de voz remoto usando o NAO a."""
import sys
import time
import speech_recognition as sr
from naoqi import ALProxy, ALBroker, ALModule

# Importa as mesmas dependências do seu reconhecedor local
from thefuzz import process
from config.settings import ARQUIVO_MAPA_LETRAS
from services.reconhecimento_voz import carregar_mapa_letras, MAPA_LETRAS_REVERSO, VOCABULARIO_LETRAS

# --- Variáveis Globais para o Módulo de Áudio ---

NOME_MODULO_AUDIO = "ReconhecedorRemoto"

class ConexaoNAO:
    """Gerencia a conexão com o robô NAO."""
    def __init__(self):
        self.session = None
        self.ip = None
        self.port = None

    def conectar(self, ip: str, port: int = 9559) -> bool:
        """Conecta-se ao NAO."""
        if self.session:
            return True
        try:
            self.session = ALProxy("ALSession", ip, port)
            self.ip = ip
            self.port = port
            return True
        except Exception as e:
            print(f"Falha ao conectar ao NAO: {e}")
            self.session = None
            return False

    def desconectar(self):
        """Desconecta-se do NAO."""
        if self.session:
            self.session = None

    def obter_servico(self, nome_servico: str):
        """Obtém um serviço do NAO."""
        if not self.session:
            return None
        try:
            return self.session.service(nome_servico)
        except Exception as e:
            print(f"Falha ao obter o serviço '{nome_servico}': {e}")
            return None

class ReconhecimentoVozNAO(ALModule):
    """
    Módulo remoto que se inscreve no ALAudioDevice do NAO para receber o stream 
    de áudio e processá-lo no PC.
    """
    def __init__(self, nome, callback_letra, callback_final, ip, port):
        super(ReconhecimentoVozNAO, self).__init__(nome)
        self.reconhecedor = sr.Recognizer()
        self.reconhecedor.pause_threshold = 1.5
        self.audio_proxy = ALProxy("ALAudioDevice", ip, port)
        
        self.escutando = False
        self.soletracao_atual = ""
        
        # Callbacks para interagir com a interface ou lógica do jogo
        self.callback_letra = callback_letra
        self.callback_final = callback_final

        # Configurações do áudio do NAO
        # 4 canais (microfones), 16000 Hz, formato interleaved
        self.taxa_amostragem = 16000
        self.canais = 4
        # Largura da amostra em bytes (16 bits = 2 bytes)
        self.largura_amostra = 2

    def iniciar_escuta(self, soletracao_inicial: str):
        """Inicia o processo de escuta e reconhecimento."""
        if self.escutando:
            return
            
        print("Iniciando escuta remota no NAO...")
        self.soletracao_atual = soletracao_inicial
        self.escutando = True
        # (nome do módulo, taxa de amostragem, canais, 0=interleaved)
        self.audio_proxy.setClientPreferences(self.getName(), self.taxa_amostragem, self.canais, 0)
        self.audio_proxy.subscribe(self.getName())

    def parar_escuta(self):
        """Para o processo de escuta."""
        if not self.escutando:
            return

        print("Parando escuta remota...")
        self.escutando = False
        self.audio_proxy.unsubscribe(self.getName())
        if self.callback_final:
            self.callback_final()

    def processRemote(self, nbOfChannels, nbrOfSamplesByChannel, timeStamp, inputBuffer):
        """
        Este é o método callback que o NAO chama remotamente.
        Ele recebe os dados do áudio e os processa.
        """
        if not self.escutando:
            return

        try:
            # Cria um objeto AudioData com os bytes recebidos do NAO
            audio_data = sr.AudioData(
                frame_data=inputBuffer,
                sample_rate=self.taxa_amostragem,
                sample_width=self.largura_amostra
            )

            # Tenta reconhecer o que foi dito usando o Google Speech API
            texto = self.reconhecedor.recognize_google(audio_data, language='pt-BR').lower()
            print(f"Texto bruto reconhecido: '{texto}'")

            # Usa a lógica de correspondência fuzzy que você já tinha
            melhor_correspondencia, pontuacao = process.extractOne(texto, VOCABULARIO_LETRAS)
            
            if pontuacao >= 75:
                letra = MAPA_LETRAS_REVERSO[melhor_correspondencia]
                self.soletracao_atual += letra
                print(f"Letra reconhecida: '{letra}' (Confiança: {pontuacao}%) -> Soletracao: '{self.soletracao_atual}'")
                if self.callback_letra:
                    self.callback_letra(self.soletracao_atual)

        except (sr.UnknownValueError, sr.RequestError) as e:
            # Ignora erros se o som for ininteligível ou houver problema na API
            # print(f"Não foi possível reconhecer o áudio: {e}")
            pass
        except Exception as e:
            print(f"Ocorreu um erro inesperado no processamento de áudio: {e}")
            self.parar_escuta()