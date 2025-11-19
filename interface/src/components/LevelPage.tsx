import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { useApi } from "../contexts/ApiContext";
import type { Grade, MicrophoneSource, AudioOutput } from "../data/words";

export function LevelPage() {
  const [grade, setGrade] = useState<Grade>("1º Ano");
  const [microphoneSource, setMicrophoneSource] = useState<MicrophoneSource>("PC");
  const [audioOutput, setAudioOutput] = useState<AudioOutput>("Sistema");
  const { setLevel, setMicSource, setAudioOutput, startGame } = useApi();

  const handleStart = async () => {
    await setLevel(grade);
    await setMicSource(microphoneSource);
    await setAudioOutput(audioOutput);
    await startGame();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB]">
      <div className="w-full max-w-2xl animate-in slide-in-from-bottom duration-700">
        <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/40 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-[#64B5F6]/30 to-[#42A5F5]/30 pb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-[#64B5F6] to-[#42A5F5] rounded-full p-6 shadow-xl">
                <Settings className="w-16 h-16 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <CardTitle className="text-white text-4xl">
              Configurações do Jogo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="space-y-3">
              <Label htmlFor="grade" className="text-white text-xl">
                Ano Escolar
              </Label>
              <Select value={grade} onValueChange={(value) => setGrade(value as Grade)}>
                <SelectTrigger 
                  id="grade" 
                  className="bg-white/90 border-2 border-[#64B5F6] text-[#1A237E] h-14 text-lg rounded-xl shadow-lg"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-[#64B5F6]">
                  <SelectItem value="1º Ano" className="text-lg">1º Ano</SelectItem>
                  <SelectItem value="2º Ano" className="text-lg">2º Ano</SelectItem>
                  <SelectItem value="3º Ano" className="text-lg">3º Ano</SelectItem>
                  <SelectItem value="4º Ano" className="text-lg">4º Ano</SelectItem>
                  <SelectItem value="5º Ano" className="text-lg">5º Ano</SelectItem>
                  <SelectItem value="6º Ano" className="text-lg">6º Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="microphone" className="text-white text-xl">
                Fonte do Microfone
              </Label>
              <Select 
                value={microphoneSource} 
                onValueChange={(value) => setMicrophoneSource(value as MicrophoneSource)}
              >
                <SelectTrigger 
                  id="microphone" 
                  className="bg-white/90 border-2 border-[#64B5F6] text-[#1A237E] h-14 text-lg rounded-xl shadow-lg"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-[#64B5F6]">
                  <SelectItem value="PC" className="text-lg">PC</SelectItem>
                  <SelectItem value="NAO" className="text-lg">NAO</SelectItem>
                  <SelectItem value="Híbrido" className="text-lg">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="audio" className="text-white text-xl">
                Saída de Áudio
              </Label>
              <Select 
                value={audioOutput} 
                onValueChange={(value) => setAudioOutput(value as AudioOutput)}
              >
                <SelectTrigger 
                  id="audio" 
                  className="bg-white/90 border-2 border-[#64B5F6] text-[#1A237E] h-14 text-lg rounded-xl shadow-lg"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-[#64B5F6]">
                  <SelectItem value="Sistema" className="text-lg">Sistema</SelectItem>
                  <SelectItem value="NAO" className="text-lg">NAO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6">
              <Button
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-[#64B5F6] to-[#42A5F5] hover:from-[#42A5F5] hover:to-[#1E88E5] text-white py-8 rounded-xl shadow-2xl border-2 border-white/30 hover:scale-[1.02] transition-all duration-300"
              >
                <span className="text-2xl">Começar a Jogar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}