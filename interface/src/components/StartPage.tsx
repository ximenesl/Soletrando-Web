import { Play, Bot, Wifi, WifiOff, Mic, Speaker } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useNao } from "../contexts/NaoContext";
import { useApi } from "../contexts/ApiContext";
import logoImage from "figma:asset/f1dd5cb6a4f60330cb2aa366472dc1ecedb5e035.png";

interface StartPageProps {
  onStartGame: () => void;
}

export function StartPage({ onStartGame }: StartPageProps) {
  const { naoIp, setNaoIp, isConnected, isConnecting, connectToNao } =
    useNao();
  const { gameState, setMicSource, setApiAudioOutput } = useApi();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB]">
      <div className="max-w-3xl w-full flex flex-col items-center space-y-8 animate-in zoom-in duration-700">
        <div className="w-full flex justify-center mb-4 pl-11">
          <img
            src={logoImage}
            alt="Soletrando"
            className="w-80 h-auto drop-shadow-2xl animate-pulse"
          />
        </div>

        <div className="w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-white/30 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              <Bot className="inline-block w-8 h-8 mr-2" />
              Conectar ao Robô NAO
            </h2>
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                value={naoIp}
                onChange={(e) => setNaoIp(e.target.value)}
                placeholder="Endereço de IP do NAO"
                className="bg-white/20 text-white border-white/30 placeholder:text-white/70"
                disabled={isConnecting || isConnected}
              />
              <Button
                onClick={connectToNao}
                disabled={isConnecting || isConnected}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {isConnecting ? "Conectando..." : "Conectar"}
              </Button>
            </div>
            <div className="text-center mt-3 text-white">
              {isConnected ? (
                <span className="flex items-center justify-center text-green-300">
                  <Wifi className="w-5 h-5 mr-2" /> Conectado
                </span>
              ) : (
                <span className="flex items-center justify-center text-red-300">
                  <WifiOff className="w-5 h-5 mr-2" /> Desconectado
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-white/20 my-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Mic className="w-5 h-5 mr-2" />
                Fonte de Microfone
              </h3>
              <RadioGroup
                value={gameState?.fonte_microfone || 'pc'}
                onValueChange={setMicSource}
                disabled={!isConnected}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pc" id="mic-pc" />
                  <Label htmlFor="mic-pc">Computador</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="mic-nao" />
                  <Label htmlFor="mic-nao">Robô NAO</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Speaker className="w-5 h-5 mr-2" />
                Saída de Áudio
              </h3>
              <RadioGroup
                value={gameState?.saida_audio || 'sistema'}
                onValueChange={setApiAudioOutput}
                disabled={!isConnected}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sistema" id="audio-sistema" />
                  <Label htmlFor="audio-sistema">Computador</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="audio-nao" />
                  <Label htmlFor="audio-nao">Robô NAO</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <Button
            onClick={onStartGame}
            className="bg-gradient-to-r from-[#64B5F6] to-[#42A5F5] hover:from-[#42A5F5] hover:to-[#1E88E5] text-white px-20 py-8 rounded-full shadow-2xl border-2 border-white/30 hover:scale-[1.03] transition-all duration-300 text-2xl"
          >
            <Play className="w-8 h-8 mr-3" strokeWidth={3} />
            Iniciar Jogo
          </Button>
        </div>
      </div>
    </div>
  );
}