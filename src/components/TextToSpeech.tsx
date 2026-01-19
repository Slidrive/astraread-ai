import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { SpeakerHigh, SpeakerSlash, Pause, Play } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface TextToSpeechProps {
  text: string;
  currentChunkIndex: number;
  onChunkChange: (index: number) => void;
  totalChunks: number;
}

export function TextToSpeech({ text, currentChunkIndex, onChunkChange, totalChunks }: TextToSpeechProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState([1.0]);
  const [pitch, setPitch] = useState([1.0]);
  const [volume, setVolume] = useState([0.8]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (isEnabled && isSpeaking) {
      speakText();
    }
  }, [currentChunkIndex]);

  const speakText = () => {
    if (!text) {
      toast.error('No text to speak');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate[0];
    utterance.pitch = pitch[0];
    utterance.volume = volume[0];

    utterance.onend = () => {
      setIsSpeaking(false);
      if (currentChunkIndex < totalChunks - 1) {
        onChunkChange(currentChunkIndex + 1);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error('Speech synthesis error');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleToggle = () => {
    if (!isEnabled) {
      setIsEnabled(true);
      speakText();
      toast.success('Text-to-speech enabled');
    } else {
      setIsEnabled(false);
      setIsSpeaking(false);
      window.speechSynthesis.cancel();
      toast.success('Text-to-speech disabled');
    }
  };

  const handlePlayPause = () => {
    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        speakText();
      }
      setIsSpeaking(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <Card className="bg-slate-900/70 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {isEnabled ? (
              <SpeakerHigh size={20} className="text-blue-400" />
            ) : (
              <SpeakerSlash size={20} className="text-muted-foreground" />
            )}
            Text-to-Speech
          </CardTitle>
          <Button
            onClick={handleToggle}
            size="sm"
            variant={isEnabled ? 'default' : 'outline'}
          >
            {isEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEnabled ? (
          <>
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePlayPause}
                size="sm"
                className="flex-1"
                disabled={!text}
              >
                {isSpeaking ? (
                  <>
                    <Pause size={16} className="mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-2" />
                    {window.speechSynthesis.paused ? 'Resume' : 'Speak'}
                  </>
                )}
              </Button>
              <Button onClick={handleStop} size="sm" variant="outline">
                Stop
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Voice</label>
                  {isSpeaking && <Badge variant="outline" className="text-xs">Speaking...</Badge>}
                </div>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger className="bg-slate-950/60 border-slate-700">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 max-h-[200px]">
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Speech Rate</label>
                  <span className="text-xs text-muted-foreground">{rate[0].toFixed(1)}x</span>
                </div>
                <Slider
                  value={rate}
                  onValueChange={setRate}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Pitch</label>
                  <span className="text-xs text-muted-foreground">{pitch[0].toFixed(1)}</span>
                </div>
                <Slider
                  value={pitch}
                  onValueChange={setPitch}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Volume</label>
                  <span className="text-xs text-muted-foreground">{Math.round(volume[0] * 100)}%</span>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">
            Enable text-to-speech to listen to the content while reading
          </p>
        )}
      </CardContent>
    </Card>
  );
}
