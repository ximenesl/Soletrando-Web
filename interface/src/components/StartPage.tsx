import { Play } from "lucide-react";
import { Button } from "./ui/button";
import logoImage from "figma:asset/f1dd5cb6a4f60330cb2aa366472dc1ecedb5e035.png";

interface StartPageProps {
  onStartGame: () => void;
}

export function StartPage({ onStartGame }: StartPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB]">
      <div className="max-w-3xl w-full flex flex-col items-center space-y-12 animate-in zoom-in duration-700">
        <div className="w-full flex justify-center mb-8 pl-11">
          <img 
            src={logoImage} 
            alt="Soletrando" 
            className="w-80 h-auto drop-shadow-2xl animate-pulse"
          />
        </div>

        <div className="w-full bg-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border-2 border-white/30">
          <h2 className="text-white mb-6 text-center">Você está pronto para esta aventura?</h2>
        </div>

        <div className="pt-8 space-y-4">
          <Button
            onClick={onStartGame}
            className="bg-gradient-to-r from-[#64B5F6] to-[#42A5F5] hover:from-[#42A5F5] hover:to-[#1E88E5] text-white px-20 py-10 rounded-full shadow-2xl border-2 border-white/30 hover:scale-[1.03] transition-all duration-300"
          >
            <Play className="w-8 h-8 mr-3" strokeWidth={3} />
            <span className="text-2xl">Iniciar Jogo</span>
          </Button>
        </div>
      </div>
    </div>
  );
}