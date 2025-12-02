import { useEffect, useState, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { parseTextIntoChunks, TextChunk } from '@/lib/text-parser';
import { runOcrOnFile } from '@/lib/ocr-service';
import { ReadingDisplay } from '@/components/ReadingDisplay';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { 
  Play, 
  Pause, 
  ArrowCounterClockwise, 
  ArrowLeft, 
  ArrowRight,
  UploadSimple,
  Image as ImageIcon,
  TextAa
} from '@phosphor-icons/react';
import { toast } from 'sonner';

const SAMPLE_TEXT = `Speed reading is a collection of techniques that aim to increase reading speed without greatly reducing comprehension or retention. Methods include skimming, meta guiding, and eliminating subvocalization. The many available speed reading training programs may utilize books, videos, software, and seminars. The most effective techniques often involve training the eyes to make shorter fixations and broader saccades across the text.

Research has shown that skilled readers can read at rates of up to 1000 words per minute, though average reading speeds are typically between 200 and 300 words per minute. The relationship between reading speed and comprehension is complex, with some studies suggesting that increasing speed beyond natural limits may reduce understanding and retention of material.

Modern speed reading applications leverage technology to present text in optimal ways for rapid consumption. By chunking text into meaningful phrases and highlighting focus words, these tools help readers maintain comprehension while dramatically increasing their reading pace. The key is finding the right balance between speed and understanding for each individual reader.`;

function App() {
  const [inputText, setInputText] = useState('');
  const [chunks, setChunks] = useKV<TextChunk[]>('reading-chunks', []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useKV<number>('reading-wpm', 500);
  const [showInput, setShowInput] = useState(true);
  const [isParsing, setIsParsing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeChunks = chunks || [];
  const safeWpm = wpm || 500;
  const currentChunk = safeChunks[currentIndex] || null;
  const progress = safeChunks.length > 0 ? (currentIndex / safeChunks.length) * 100 : 0;
  const totalWords = safeChunks.reduce((acc, chunk) => acc + chunk.words.length, 0);
  const wordsRead = safeChunks.slice(0, currentIndex).reduce((acc, chunk) => acc + chunk.words.length, 0);
  const wordsRemaining = totalWords - wordsRead;
  const minutesRemaining = wordsRemaining / safeWpm;

  useEffect(() => {
    if (safeChunks.length === 0) {
      setShowInput(true);
    }
  }, [safeChunks.length]);

  useEffect(() => {
    if (!isPlaying) return;

    const msPerChunk = (60000 / safeWpm) * (currentChunk?.words.length || 1);
    const timer = setTimeout(() => {
      if (currentIndex < safeChunks.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsPlaying(false);
        toast.success('Reading complete!');
      }
    }, msPerChunk);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, safeChunks.length, safeWpm, currentChunk]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (safeChunks.length > 0) {
            setIsPlaying(!isPlaying);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          restart();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, safeChunks.length, currentIndex]);

  const handleParse = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text');
      return;
    }

    const wordCount = inputText.trim().split(/\s+/).length;
    if (wordCount < 10) {
      toast.error('Please enter at least 10 words');
      return;
    }

    setIsParsing(true);
    toast.info('Analyzing text...');

    try {
      const parsedChunks = await parseTextIntoChunks(inputText);
      setChunks(parsedChunks);
      setCurrentIndex(0);
      setShowInput(false);
      toast.success(`Parsed ${parsedChunks.length} chunks from ${wordCount} words`);
    } catch (error) {
      toast.error('Failed to parse text');
      console.error(error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setSelectedFile(file);
    setIsParsing(true);
    setOcrProgress(0);
    toast.info('Reading image...');

    try {
      const ocrResult = await runOcrOnFile(file, 'eng', (progress) => {
        setOcrProgress(Math.round(progress * 100));
      });

      if (!ocrResult.text.trim()) {
        toast.error('No text found in image');
        return;
      }

      const wordCount = ocrResult.text.trim().split(/\s+/).length;
      toast.success(`Extracted ${wordCount} words (${Math.round(ocrResult.confidence)}% confidence)`);

      const parsedChunks = await parseTextIntoChunks(ocrResult.text);
      setChunks(parsedChunks);
      setCurrentIndex(0);
      setShowInput(false);
      setInputText(ocrResult.text);
    } catch (error) {
      toast.error('Failed to process image');
      console.error(error);
    } finally {
      setIsParsing(false);
      setOcrProgress(0);
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const skipForward = () => {
    if (currentIndex < safeChunks.length - 1) {
      setCurrentIndex(currentIndex + 10 < safeChunks.length ? currentIndex + 10 : safeChunks.length - 1);
    }
  };

  const skipBackward = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 10 > 0 ? currentIndex - 10 : 0);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const handleNewText = () => {
    setIsPlaying(false);
    setShowInput(true);
    setInputText('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster />
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Speed Reader</h1>
          {safeChunks.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleNewText}
            >
              <UploadSimple className="mr-2" />
              New Text
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <ReadingDisplay chunk={currentChunk} isPlaying={isPlaying} />

        {safeChunks.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Math.round(progress)}% complete</span>
                <span>{minutesRemaining < 1 ? '<1' : Math.round(minutesRemaining)} min remaining</span>
              </div>
            </div>

            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={skipBackward}
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft className="mr-2" />
                  Skip Back
                </Button>

                <Button
                  size="lg"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="min-w-[140px]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2" weight="fill" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2" weight="fill" />
                      Play
                    </>
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={skipForward}
                  disabled={currentIndex === safeChunks.length - 1}
                >
                  Skip Forward
                  <ArrowRight className="ml-2" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={restart}
                >
                  <ArrowCounterClockwise className="mr-2" />
                  Restart
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Reading Speed</label>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-accent">{safeWpm}</span>
                    <span className="text-sm text-muted-foreground font-medium">WPM</span>
                  </div>
                </div>
                <Slider
                  value={[safeWpm]}
                  onValueChange={(value) => setWpm(value[0])}
                  min={200}
                  max={1000}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between gap-2">
                  {[300, 500, 700].map((speed) => (
                    <Button
                      key={speed}
                      size="sm"
                      variant={safeWpm === speed ? 'default' : 'outline'}
                      onClick={() => setWpm(speed)}
                      className="flex-1"
                    >
                      {speed}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>Keyboard shortcuts: Space = Play/Pause | ← → = Skip | R = Restart</p>
              <p className="text-xs">{wordsRead} / {totalWords} words read</p>
            </div>
          </div>
        )}
      </main>

      <Dialog open={showInput} onOpenChange={setShowInput}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Enter Text to Read</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">
                <TextAa className="mr-2" />
                Paste Text
              </TabsTrigger>
              <TabsTrigger value="image">
                <ImageIcon className="mr-2" />
                Upload Image
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-4">
              <Textarea
                id="reading-text-input"
                placeholder="Paste your text here... (minimum 10 words)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[300px] resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {inputText.trim().split(/\s+/).filter(w => w).length} words
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setInputText(SAMPLE_TEXT)}
                  >
                    Load Sample
                  </Button>
                </div>
                <Button 
                  onClick={handleParse}
                  disabled={isParsing || !inputText.trim()}
                  size="lg"
                >
                  {isParsing ? 'Parsing...' : 'Start Reading'}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="image" className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                {isParsing ? (
                  <div className="space-y-4 w-full max-w-xs">
                    <ImageIcon className="mx-auto text-primary" size={48} />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Processing image...</p>
                      <Progress value={ocrProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">{ocrProgress}%</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mb-4 text-muted-foreground" size={48} />
                    <h3 className="text-lg font-semibold mb-2">Upload an Image</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      PNG, JPG, or other image formats
                    </p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                    >
                      <UploadSimple className="mr-2" />
                      Choose Image
                    </Button>
                  </>
                )}
              </div>
              {!isParsing && (
                <p className="text-xs text-muted-foreground text-center">
                  The image will be processed using OCR to extract readable text
                </p>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
