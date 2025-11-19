import { Trophy, RotateCcw, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useApi } from "../contexts/ApiContext";

interface EndPageProps {
  onPlayAgain: () => void;
}

export function EndPage({ onPlayAgain }: EndPageProps) {
  const { gameState } = useApi();
  const correctCount = gameState?.pontuacao.acertos ?? 0;
  const incorrectCount = gameState?.pontuacao.erros ?? 0;

  const total = correctCount + incorrectCount;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB]">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in zoom-in duration-700">
        <div className="flex justify-center mb-8 relative">
          <div className="bg-gradient-to-br from-[#64B5F6] to-[#42A5F5] rounded-full p-10 shadow-2xl animate-bounce">
            <Trophy className="w-28 h-28 text-white" strokeWidth={2.5} />
          </div>
          <Award className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 text-[#90CAF9] animate-pulse" fill="currentColor" />
        </div>

        <h1 className="text-white text-5xl mb-4">Fim de Jogo!</h1>

        <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/40 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#64B5F6]/30 to-[#42A5F5]/30 pb-6">
            <CardTitle className="text-white text-3xl">
              Pontuação Final
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#4FC3F7] to-[#29B6F6] rounded-xl p-6 shadow-xl border-2 border-white/30">
                <p className="text-white/90 text-lg mb-2">Acertos</p>
                <p className="text-white text-5xl">{correctCount}</p>
              </div>

              <div className="bg-gradient-to-br from-[#5C6BC0] to-[#3F51B5] rounded-xl p-6 shadow-xl border-2 border-white/30">
                <p className="text-white/90 text-lg mb-2">Erros</p>
                <p className="text-white text-5xl">{incorrectCount}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#64B5F6] to-[#42A5F5] rounded-xl p-6 shadow-xl border-2 border-white/30">
              <p className="text-white/90 text-lg mb-2">Aproveitamento</p>
              <p className="text-white text-6xl">{percentage}%</p>
            </div>

            <div className="bg-white/10 rounded-xl p-5 border-2 border-white/30">
              {percentage >= 70 && (
                <p className="text-white text-xl">
                  Excelente! Você é um campeão da soletração!
                </p>
              )}
              {percentage >= 50 && percentage < 70 && (
                <p className="text-white text-xl">
                  Muito bom! Continue praticando!
                </p>
              )}
              {percentage < 50 && (
                <p className="text-white text-xl">
                  Não desista! A prática leva à perfeição!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="pt-4">
          <Button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-[#64B5F6] to-[#42A5F5] hover:from-[#42A5F5] hover:to-[#1E88E5] text-white px-16 py-10 rounded-full shadow-2xl border-2 border-white/30 hover:scale-[1.03] transition-all duration-300"
          >
            <RotateCcw className="w-7 h-7 mr-3" strokeWidth={2.5} />
            <span className="text-2xl">Jogar Novamente</span>
          </Button>
        </div>
      </div>
    </div>
  );
}