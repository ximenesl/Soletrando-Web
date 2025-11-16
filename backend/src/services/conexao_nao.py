"""Módulo para reconhecimento de voz remoto usando o NAO a."""
import qi
import sys
import time
import speech_recognition as sr
import numpy as np

# Importa as mesmas dependências do seu reconhecedor local
from thefuzz import process
from config.settings import ARQUIVO_MAPA_LETRAS
from services.reconhecimento_voz import carregar_mapa_letras, MAPA_LETRAS_REVERSO, VOCABULARIO_LETRAS

# --- Variáveis Globais para o Módulo de Áudio ---

NOME_MODULO_AUDIO = "ReconhecedorRemoto"

class ConexaoNAO:
    """Gerencia a conexão com o robô NAO."""
    def __init__(self):
        self.application = None
        self.session = None
        self.ip = None
        self.port = None

    def conectar(self, ip: str, port: int = 9559) -> bool:
        """Conecta-se ao NAO."""
        if self.session:
            return True
        try:
            connection_url = f"tcp://{ip}:{port}"
            self.application = qi.Application([NOME_MODULO_AUDIO, "--qi-url=" + connection_url])
            self.application.start()
            self.session = self.application.session
            self.ip = ip
            self.port = port
            return True
        except Exception as e:
            print(f"Falha ao conectar ao NAO: {e}")
            self.application = None
            self.session = None
            return False

    def desconectar(self):
        """Desconecta-se do NAO."""
        if self.application:
            self.application.stop()
            self.application = None
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

class ReconhecimentoVozNAO(object):
    """
    Módulo remoto que se inscreve no ALAudioDevice do NAO para receber o stream 
    de áudio e processá-lo no PC.
    """
    def __init__(self, app, callback_letra, callback_final):
        super(ReconhecimentoVozNAO, self).__init__()
        app.start()
        session = app.session
        self.audio_service = session.service("ALAudioDevice")
        self.isProcessingDone = False
        self.reconhecedor = sr.Recognizer()
        self.reconhecedor.pause_threshold = 1.5
        
        self.escutando = False
        
        # Callbacks para interagir com a interface ou lógica do jogo
        self.callback_letra = callback_letra
        self.callback_final = callback_final

        # Configurações do áudio do NAO
        self.taxa_amostragem = 16000
        self.canais = 4
        self.largura_amostra = 2
        self.module_name = NOME_MODULO_AUDIO

    def iniciar_escuta(self):
        """Inicia o processo de escuta e reconhecimento."""
        if self.escutando:
            return
            
        print("Iniciando escuta remota no NAO...")
        self.escutando = True
        self.audio_service.setClientPreferences(self.module_name, self.taxa_amostragem, self.canais, 0)
        self.audio_service.subscribe(self.module_name)

    def parar_escuta(self):
        """Para o processo de escuta."""
        if not self.escutando:
            return

        print("Parando escuta remota...")
        self.escutando = False
        self.audio_service.unsubscribe(self.module_name)
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
            audio_data = sr.AudioData(
                frame_data=inputBuffer,
                sample_rate=self.taxa_amostragem,
                sample_width=self.largura_amostra
            )

            texto = self.reconhecedor.recognize_google(audio_data, language='pt-BR').lower()
            print(f"Texto bruto reconhecido: '{texto}'")

            melhor_correspondencia, pontuacao = process.extractOne(texto, VOCABULARIO_LETRAS)
            
            if pontuacao >= 75:
                letra = MAPA_LETRAS_REVERSO[melhor_correspondencia]
                print(f"Letra reconhecida: '{letra}' (Confiança: {pontuacao}%)")
                if self.callback_letra:
                    self.callback_letra(letra)

        except (sr.UnknownValueError, sr.RequestError) as e:
            pass
        except Exception as e:
            print(f"Ocorreu um erro inesperado no processamento de áudio: {e}")
            self.parar_escuta()