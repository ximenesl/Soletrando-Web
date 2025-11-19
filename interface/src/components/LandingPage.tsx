import { Button } from "./ui/button";
import logoImage from "figma:asset/f1dd5cb6a4f60330cb2aa366472dc1ecedb5e035.png";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB]">
      <div className="max-w-4xl w-full flex flex-col items-center space-y-10 animate-in fade-in duration-700">
        <div className="w-full flex justify-center mb-8 pl-11">
          <img 
            src={logoImage} 
            alt="Soletrando" 
            className="w-80 h-auto drop-shadow-2xl"
          />
        </div>
        
        <div className="w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/30">
          <h3 className="text-[#64B5F6] mb-6 text-center">
            Um jogo de soletração interativo com o robô NAO
          </h3>

          <div className="space-y-4 text-white text-lg">
            <p className="bg-gradient-to-r from-[#64B5F6]/30 to-[#42A5F5]/30 rounded-2xl p-4 border border-[#64B5F6]/40">
              Este projeto é um jogo de soletração onde os jogadores podem testar suas habilidades de soletração. 
              A aplicação web se conecta a um backend Python que gerencia a lógica do jogo.
            </p>
            <p className="bg-gradient-to-r from-[#FEC84E]/30 to-[#FFA726]/30 rounded-2xl p-4 border border-[#FEC84E]/40">
              Uma característica especial é a integração com o robô NAO, que pode ser usado como um microfone 
              para a entrada de voz, proporcionando uma experiência mais interativa.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <Button
            onClick={onStart}
            className="bg-gradient-to-r from-[#64B5F6] to-[#42A5F5] hover:from-[#42A5F5] hover:to-[#1E88E5] text-white px-16 py-8 rounded-full shadow-2xl border-2 border-white/30 hover:scale-[1.03] transition-all duration-300"
          >
            <span className="text-2xl">Iniciar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}