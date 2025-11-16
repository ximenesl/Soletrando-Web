"""Módulo para reconhecimento de voz."""
import speech_recognition as sr
import json
import sys
import asyncio
from thefuzz import process
from config.settings import ARQUIVO_MAPA_LETRAS

def carregar_mapa_letras(caminho_arquivo: str) -> tuple[dict, dict, list]:
    """Carrega o mapa de letras de um arquivo JSON."""
    try:
        with open(caminho_arquivo, 'r', encoding='utf-8') as f:
            mapa_letras = json.load(f)
        
        mapa_reverso = {palavra_falada: letra 
                        for letra, palavras_faladas in mapa_letras.items() 
                        for palavra_falada in palavras_faladas}
        
        vocabulario = list(mapa_reverso.keys())

        return mapa_letras, mapa_reverso, vocabulario
    except (FileNotFoundError, json.JSONDecodeError):
        return {}, {}, []

MAPA_LETRAS, MAPA_LETRAS_REVERSO, VOCABULARIO_LETRAS = carregar_mapa_letras(ARQUIVO_MAPA_LETRAS)

class ReconhecimentoVozPC:
    """Gerencia o reconhecimento de voz usando o microfone do PC."""
    def __init__(self, device_index: int | None = None):
        self.reconhecedor = sr.Recognizer()
        self.reconhecedor.pause_threshold = 1.5
        self.escutando = False
        self.device_index = device_index

    def ouvir_soletracao(self, callback_letra: callable, callback_final: callable):
        """Inicia o reconhecimento contínuo de letras a partir de um estado inicial."""
        asyncio.set_event_loop(asyncio.new_event_loop())
        self.escutando = True

        print("Microfones disponíveis:")
        for index, name in enumerate(sr.Microphone.list_microphone_names()):
            print(f'  - [{index}] {name}')

        try:
            with sr.Microphone(device_index=self.device_index) as source:
                print(f"Usando microfone: {sr.Microphone.list_microphone_names()[self.device_index or 0]}")
                self.reconhecedor.adjust_for_ambient_noise(source, duration=0.5)

                while self.escutando:
                    try:
                        print("Ouvindo...")
                        audio = self.reconhecedor.listen(source, timeout=5, phrase_time_limit=3)
                        print("Processando áudio...")
                        texto = self.reconhecedor.recognize_google(audio, language='pt-BR').lower()
                        print(f"Texto bruto reconhecido: '{texto}'")

                        melhor_correspondecia, pontuacao = process.extractOne(texto, VOCABULARIO_LETRAS)
                        print(f"Melhor correspondência: '{melhor_correspondecia}' com pontuação {pontuacao}")
                        
                        if pontuacao >= 75:
                            letra = MAPA_LETRAS_REVERSO[melhor_correspondecia]
                            print(f"Letra reconhecida: {letra}")
                            callback_letra(letra) 

                    except sr.WaitTimeoutError:
                        print("Nenhuma fala detectada.")
                        continue
                    except (sr.UnknownValueError, sr.RequestError) as e:
                        print(f"Erro no reconhecimento: {e}")
                        continue
        except Exception as e:
            print(f"Erro inesperado no reconhecimento de voz: {e}")
        finally:
            print("Finalizando o reconhecimento de voz.")
            self.escutando = False
            callback_final()

    def parar_de_ouvir(self):
        """Para o loop de reconhecimento de voz."""
        self.escutando = False