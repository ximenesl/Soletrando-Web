import { Volume2, Mic, MicOff, Delete, Check, ArrowRight, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { useApi } from "../contexts/ApiContext";

export function GamePage() {
  const { gameState, spell, stopSpelling, checkSpelling, backspace, nextRound } = useApi();

  const speakWord = () => {
    if ('speechSynthesis' in window && gameState?.palavra_atual) {
      const utterance = new SpeechSynthesisUtterance(gameState.palavra_atual.toLowerCase());
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-2xl">Carregando...</p>
      </div>
    );
  }

  const {
    rodada_atual,
    palavra_atual,
    soletracao_usuario,
    escutando,
    resultado_rodada,
    pontuacao,
    total_rodadas,
  } = gameState;

  const userSpellingArray = soletracao_usuario ? soletracao_usuario.split('') : [];

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/40 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#64B5F6]/30 to-[#42A5F5]/30">
                <CardTitle className="text-white text-center flex items-center justify-center gap-3">
                  <Target className="w-7 h-7 text-[#64B5F6]" />
                  <span className="text-2xl">Rodada {rodada_atual} de {total_rodadas}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6 md:p-8">
                {/* Listen to word */}
                <div className="text-center space-y-4">
                  <p className="text-white text-xl">Ouça a palavra:</p>
                  <Button
                    onClick={speakWord}
                    className="bg-gradient-to-r from-[#64B5F6] to-[#42A5F5] hover:from-[#42A5F5] hover:to-[#1E88E5] text-white px-10 py-7 rounded-xl shadow-xl border-2 border-white/30 hover:scale-[1.02] transition-all"
                  >
                    <Volume2 className="w-7 h-7 mr-3" strokeWidth={2.5} />
                    <span className="text-xl">Reproduzir Palavra</span>
                  </Button>
                </div>

                {/* User spelling display */}
                <div className="space-y-3">
                  <p className="text-white text-xl">
                    Você soletrou:
                  </p>
                  <div className="bg-gradient-to-r from-[#64B5F6]/20 to-[#42A5F5]/20 backdrop-blur-sm rounded-xl p-8 min-h-[120px] flex items-center justify-center border-2 border-white/30">
                    {userSpellingArray.length > 0 ? (
                      <div className="flex flex-wrap gap-3 justify-center">
                        {userSpellingArray.map((letter, index) => (
                          <div
                            key={index}
                            className="bg-white text-[#1A237E] w-14 h-14 flex items-center justify-center rounded-lg shadow-lg border-2 border-[#64B5F6] animate-in zoom-in"
                          >
                            <span className="text-2xl">{letter}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/50 text-xl">...</p>
                    )}
                  </div>
                </div>

                {/* Feedback */}
                {resultado_rodada && (
                  <Alert className={`${
                    resultado_rodada === "acertou" 
                      ? "bg-gradient-to-r from-[#4FC3F7] to-[#29B6F6] border-[#4FC3F7]" 
                      : "bg-gradient-to-r from-[#5C6BC0] to-[#3F51B5] border-[#5C6BC0]"
                  } border-2 shadow-xl rounded-xl animate-in zoom-in`}>
                    <AlertDescription className="text-white text-center text-lg py-3">
                      {resultado_rodada === "acertou" 
                        ? `Parabéns! Você acertou! A palavra era: ${palavra_atual}` 
                        : `A palavra correta era: ${palavra_atual}. Continue tentando!`
                      }
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-4">
                  {!escutando ? (
                    <Button
                      onClick={spell}
                      disabled={!!resultado_rodada}
                      className="bg-gradient-to-r from-[#64B5F6] to-[#42A5F5] hover:from-[#42A5F5] hover:to-[#1E88E5] text-white py-6 rounded-xl shadow-xl border-2 border-white/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all"
                    >
                      <Mic className="w-6 h-6 mr-2" strokeWidth={2.5} />
                      <span className="text-lg">Soletrar</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={stopSpelling}
                      className="bg-gradient-to-r from-[#5C6BC0] to-[#3F51B5] hover:from-[#3F51B5] hover:to-[#303F9F] text-white py-6 rounded-xl shadow-xl border-2 border-white/30 animate-pulse hover:scale-[1.02] transition-all"
                    >
                      <MicOff className="w-6 h-6 mr-2" strokeWidth={2.5} />
                      <span className="text-lg">Parar de Ouvir</span>
                    </Button>
                  )}

                  <Button
                    onClick={backspace}
                    disabled={userSpellingArray.length === 0 || !!resultado_rodada}
                    className="bg-gradient-to-r from-[#7986CB] to-[#5C6BC0] hover:from-[#5C6BC0] hover:to-[#3F51B5] text-white py-6 rounded-xl shadow-xl border-2 border-white/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all"
                  >
                    <Delete className="w-6 h-6 mr-2" strokeWidth={2.5} />
                    <span className="text-lg">Apagar</span>
                  </Button>

                  <Button
                    onClick={checkSpelling}
                    disabled={userSpellingArray.length === 0 || !!resultado_rodada}
                    className="bg-gradient-to-r from-[#4FC3F7] to-[#29B6F6] hover:from-[#29B6F6] hover:to-[#03A9F4] text-white py-6 rounded-xl shadow-xl border-2 border-white/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all"
                  >
                    <Check className="w-6 h-6 mr-2" strokeWidth={2.5} />
                    <span className="text-lg">Verificar</span>
                  </Button>

                  <Button
                    onClick={nextRound}
                    disabled={!resultado_rodada}
                    className="col-span-2 bg-gradient-to-r from-[#64B5F6] to-[#42A5F5] hover:from-[#42A5F5] hover:to-[#1E88E5] text-white py-6 rounded-xl shadow-xl border-2 border-white/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all"
                  >
                    <ArrowRight className="w-6 h-6 mr-2" strokeWidth={2.5} />
                    <span className="text-lg">
                      {rodada_atual >= total_rodadas ? "Finalizar" : "Próxima Rodada"}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scoreboard */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/40 shadow-2xl rounded-3xl sticky top-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#64B5F6]/30 to-[#42A5F5]/30">
                <CardTitle className="text-white text-center text-2xl">
                  Pontuação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="bg-gradient-to-br from-[#4FC3F7] to-[#29B6F6] rounded-xl p-6 text-center shadow-xl border-2 border-white/30">
                  <p className="text-white/90 text-lg mb-2">Acertos</p>
                  <p className="text-white text-5xl">{pontuacao.acertos}</p>
                </div>

                <div className="bg-gradient-to-br from-[#5C6BC0] to-[#3F51B5] rounded-xl p-6 text-center shadow-xl border-2 border-white/30">
                  <p className="text-white/90 text-lg mb-2">Erros</p>
                  <p className="text-white text-5xl">{pontuacao.erros}</p>
                </div>

                <div className="bg-gradient-to-r from-[#90CAF9]/40 to-[#64B5F6]/40 rounded-xl p-4 text-center border-2 border-[#90CAF9]/40">
                  <p className="text-white text-lg">
                    {pontuacao.acertos > pontuacao.erros ? "Você está indo muito bem!" : "Continue tentando!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}