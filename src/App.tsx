import React, { useEffect, useRef, useState } from 'react';
import { parseTextIntoChunks, TextChunk } from './lib/text-parser';
import { runOcrOnFile } from './lib/ocr-service';
import { Toaster, toast } from 'sonner';
import { Button } from './components/ui/button';
import { Slider } from './components/ui/slider';
import { Progress } from './components/ui/progress';
import { Textarea } from './components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Card, CardContent } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Alert, AlertDescription } from './components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const SAMPLE_TEXT = `Speed reading is a collection of techniques that aim to increase reading speed without greatly reducing comprehension or retention. Methods include skimming, meta guiding, and eliminating subvocalization. The many available speed reading training programs may utilize books, videos, software, and seminars. The most effective techniques often involve training the eyes to make shorter fixations and broader saccades across the text.

Research has shown that skilled readers can read at rates of up to 1000 words per minute, though average reading speeds are typically between 200 and 300 words per minute. The relationship between reading speed and comprehension is complex, with some studies suggesting that increasing speed beyond natural limits may reduce understanding and retention of material.

Modern speed reading applications leverage technology to present text in optimal ways for rapid consumption. By chunking text into meaningful phrases and highlighting focus words, these tools help readers maintain comprehension while dramatically increasing their reading pace. The key is finding the right balance between speed and understanding for each individual reader.`;

// Smart validation constants
const MIN_WORD_COUNT = 10;
const LARGE_TEXT_THRESHOLD = 100000;
const OCR_CONFIDENCE_THRESHOLD = 60;

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [chunks, setChunks] = useState<TextChunk[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(500);
  const [showInput, setShowInput] = useState(true);
  const [isParsing, setIsParsing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [extractedText, setExtractedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const safeChunks = chunks || [];
  const safeWpm = wpm || 500;
  const currentChunk = safeChunks[currentIndex] || null;
  const progress = safeChunks.length > 0 ? (currentIndex / safeChunks.length) * 100 : 0;
  const totalWords = safeChunks.reduce((acc, c) => acc + c.words.length, 0);
  const wordsRead = safeChunks.slice(0, currentIndex).reduce((acc, c) => acc + c.words.length, 0);
  const wordsRemaining = totalWords - wordsRead;
  const minutesRemaining = wordsRemaining > 0 ? wordsRemaining / safeWpm : 0;

  useEffect(() => {
    if (!isPlaying || !currentChunk) return;

    const msPerChunk = (60000 / safeWpm) * currentChunk.words.length;
    const timer = setTimeout(() => {
      if (currentIndex < safeChunks.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsPlaying(false);
        toast.success('Reading complete!');
      }
    }, msPerChunk);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, safeChunks, safeWpm, currentChunk]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (safeChunks.length > 0) {
            setIsPlaying(p => !p);
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

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [safeChunks.length, currentIndex]);

  const handleParse = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text');
      return;
    }
    const wordCount = inputText.trim().split(/\s+/).length;
    if (wordCount < MIN_WORD_COUNT) {
      toast.error(`Please enter at least ${MIN_WORD_COUNT} words`);
      return;
    }
    
    // Warn for large text
    if (wordCount > LARGE_TEXT_THRESHOLD) {
      toast.warning(`Processing ${wordCount.toLocaleString()} words. This may take a moment...`);
    }

    setIsParsing(true);

    try {
      const parsed = await parseTextIntoChunks(inputText);
      setChunks(parsed);
      setCurrentIndex(0);
      setShowInput(false);
      
      // Calculate estimated reading time
      const estimatedMinutes = Math.ceil(wordCount / wpm);
      toast.success(`Text loaded successfully! Estimated reading time: ${estimatedMinutes} minute${estimatedMinutes !== 1 ? 's' : ''} at ${wpm} WPM`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse text');
    } finally {
      setIsParsing(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsParsing(true);
    setOcrProgress(0);

    try {
      const { text, confidence } = await runOcrOnFile(file, 'eng', p => setOcrProgress(Math.round(p * 100)));
      if (!text) {
        toast.error('No text detected in image');
        setIsParsing(false);
        return;
      }
      
      // Store confidence and extracted text
      setOcrConfidence(confidence);
      setExtractedText(text);
      
      // Show confidence message
      if (confidence < OCR_CONFIDENCE_THRESHOLD) {
        toast.warning(`Text extracted with ${confidence.toFixed(0)}% confidence. Please review before starting.`);
      } else {
        toast.success(`Text extracted successfully! (${confidence.toFixed(0)}% confidence)`);
      }
      
      // Don't auto-parse if confidence is low
      if (confidence < OCR_CONFIDENCE_THRESHOLD) {
        setIsParsing(false);
        return;
      }
      
      // Auto-parse if confidence is good
      const parsed = await parseTextIntoChunks(text);
      setChunks(parsed);
      setCurrentIndex(0);
      setInputText(text);
    } catch (err) {
      console.error(err);
      toast.error('Failed to process image');
    } finally {
      setIsParsing(false);
      setOcrProgress(0);
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
      setCurrentIndex(Math.min(safeChunks.length - 1, currentIndex + 10));
    }
  };

  const skipBackward = () => {
    if (currentIndex > 0) {
      setCurrentIndex(Math.max(0, currentIndex - 10));
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
    setChunks([]);
    setCurrentIndex(0);
    setOcrConfidence(null);
    setActiveTab('text');
    setExtractedText('');
  };
  
  const handleStartReadingExtracted = async () => {
    if (!extractedText.trim()) {
      toast.error('No text to read');
      return;
    }
    
    const wordCount = extractedText.trim().split(/\s+/).length;
    if (wordCount < MIN_WORD_COUNT) {
      toast.error(`Please enter at least ${MIN_WORD_COUNT} words`);
      return;
    }
    
    setIsParsing(true);
    try {
      const parsed = await parseTextIntoChunks(extractedText);
      setChunks(parsed);
      setCurrentIndex(0);
      setShowInput(false);
      setInputText(extractedText);
      
      const estimatedMinutes = Math.ceil(wordCount / wpm);
      toast.success(`Text loaded successfully! Estimated reading time: ${estimatedMinutes} minute${estimatedMinutes !== 1 ? 's' : ''} at ${wpm} WPM`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse text');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex flex-col">
      <Toaster position="top-center" richColors />
      <header className="border-b border-slate-800 bg-black/40 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            <span className="text-blue-400">LearningTheForce</span>{' '}
            <span className="text-slate-200">AI Reader</span>
          </h1>
          {safeChunks.length > 0 && (
            <Button
              onClick={handleNewText}
              variant="outline"
              size="sm"
            >
              New Text
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
        {/* Reading display */}
        <div className="min-h-[160px] flex items-center justify-center mb-8">
          {currentChunk ? (
            <div className="border border-slate-700 rounded-2xl px-8 py-6 bg-slate-900/80 shadow-lg max-w-3xl w-full text-center">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">
                {isPlaying ? 'Reading…' : 'Paused'}
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-3xl md:text-4xl lg:text-5xl font-semibold">
                {currentChunk.words.map((w, idx) => {
                  const isFocusWord = idx === currentChunk.focusIndex;
                  return (
                    <span
                      key={idx}
                      className={`word-transition ${
                        isFocusWord
                          ? 'text-blue-400 reading-focus drop-shadow'
                          : 'text-slate-100/80'
                      }`}
                    >
                      {w}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              Paste some text or upload an image to begin reading.
            </p>
          )}
        </div>

        {/* Controls & progress */}
        {safeChunks.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Progress value={Math.min(100, Math.max(0, progress))} className="h-2" />
              <div className="flex justify-between text-xs text-slate-400">
                <span>{Math.round(progress)}% complete</span>
                <span>
                  {minutesRemaining < 1 ? '<1' : Math.round(minutesRemaining)} min remaining
                </span>
              </div>
            </div>

            <Card>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    onClick={skipBackward}
                    disabled={currentIndex === 0}
                    variant="outline"
                    size="sm"
                  >
                    ⬅ Skip Back
                  </Button>
                  <Button
                    onClick={() => setIsPlaying(p => !p)}
                    size="default"
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                  </Button>
                  <Button
                    onClick={skipForward}
                    disabled={currentIndex === safeChunks.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    Skip Forward ➡
                  </Button>
                  <Button
                    onClick={restart}
                    variant="outline"
                    size="sm"
                  >
                    ⟲ Restart
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Reading speed</span>
                    <span className="text-3xl font-semibold text-blue-400">{safeWpm}</span>
                  </div>
                  <Slider
                    min={200}
                    max={1000}
                    step={50}
                    value={[safeWpm]}
                    onValueChange={(values) => setWpm(values[0])}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    {[300, 500, 700].map(spd => (
                      <Button
                        key={spd}
                        onClick={() => setWpm(spd)}
                        variant={safeWpm === spd ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                      >
                        {spd} WPM
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-slate-500">
              Keyboard: Space = Play/Pause • ← / → = Skip • R = Restart • {wordsRead}/{totalWords}{' '}
              words read
            </p>
          </div>
        )}

        {/* Input dialog */}
        <Dialog open={showInput} onOpenChange={setShowInput}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Start a New Reading Session</DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'text' | 'image')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text Input</TabsTrigger>
                <TabsTrigger value="image">Image Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <div className="flex gap-2 text-sm">
                  <Button
                    onClick={() => setInputText(SAMPLE_TEXT)}
                    variant="outline"
                    size="sm"
                  >
                    Load Sample Text
                  </Button>
                </div>

                <Textarea
                  placeholder="Paste your text here…"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="w-full min-h-[180px]"
                />

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    {inputText.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                  <Button
                    onClick={handleParse}
                    disabled={isParsing}
                    size="sm"
                  >
                    {isParsing ? 'Parsing…' : 'Start Reading'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4">
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Upload an image with text:</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="text-xs text-slate-300"
                  />
                  
                  {isParsing && ocrProgress > 0 && (
                    <div className="space-y-2">
                      <Progress value={ocrProgress} className="h-2" />
                      <p className="text-xs text-center text-slate-400">Processing: {ocrProgress}%</p>
                    </div>
                  )}
                  
                  {ocrConfidence !== null && ocrConfidence < OCR_CONFIDENCE_THRESHOLD && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Low OCR confidence ({ocrConfidence.toFixed(0)}%). Please review and edit the extracted text before starting.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {extractedText && (
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Extracted Text (editable):</label>
                      <Textarea
                        value={extractedText}
                        onChange={e => setExtractedText(e.target.value)}
                        className="w-full min-h-[180px]"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {extractedText.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                        <Button
                          onClick={handleStartReadingExtracted}
                          disabled={isParsing}
                          size="sm"
                        >
                          {isParsing ? 'Parsing…' : 'Start Reading'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default App;
