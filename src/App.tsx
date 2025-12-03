import React, { useEffect, useRef, useState } from 'react';
import { parseTextIntoChunks, TextChunk } from './lib/text-parser';
import { runOcrOnFile } from './lib/ocr-service';

const SAMPLE_TEXT = `Speed reading is a collection of techniques that aim to increase reading speed without greatly reducing comprehension or retention. Methods include skimming, meta guiding, and eliminating subvocalization. The many available speed reading training programs may utilize books, videos, software, and seminars. The most effective techniques often involve training the eyes to make shorter fixations and broader saccades across the text.

Research has shown that skilled readers can read at rates of up to 1000 words per minute, though average reading speeds are typically between 200 and 300 words per minute. The relationship between reading speed and comprehension is complex, with some studies suggesting that increasing speed beyond natural limits may reduce understanding and retention of material.

Modern speed reading applications leverage technology to present text in optimal ways for rapid consumption. By chunking text into meaningful phrases and highlighting focus words, these tools help readers maintain comprehension while dramatically increasing their reading pace. The key is finding the right balance between speed and understanding for each individual reader.`;

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [chunks, setChunks] = useState<TextChunk[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(500);
  const [showInput, setShowInput] = useState(true);
  const [isParsing, setIsParsing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
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
        alert('Reading complete!');
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
      alert('Please enter some text');
      return;
    }
    const wordCount = inputText.trim().split(/\s+/).length;
    if (wordCount < 10) {
      alert('Please enter at least 10 words');
      return;
    }

    setIsParsing(true);

    try {
      const parsed = await parseTextIntoChunks(inputText);
      setChunks(parsed);
      setCurrentIndex(0);
      setShowInput(false);
    } catch (err) {
      console.error(err);
      alert('Failed to parse text');
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
        alert('No text detected in image');
        return;
      }
      console.log(`OCR confidence: ${confidence}`);
      setInputText(text);
      const parsed = await parseTextIntoChunks(text);
      setChunks(parsed);
      setCurrentIndex(0);
      setShowInput(false);
    } catch (err) {
      console.error(err);
      alert('Failed to process image');
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-black/40 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            <span className="text-blue-400">LearningTheForce</span>{' '}
            <span className="text-slate-200">AI Reader</span>
          </h1>
          {safeChunks.length > 0 && (
            <button
              onClick={handleNewText}
              className="px-3 py-1.5 text-sm rounded-md border border-slate-600 hover:bg-slate-800"
            >
              New Text
            </button>
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
              <div className="flex flex-wrap justify-center gap-3 text-4xl md:text-5xl font-semibold">
                {currentChunk.words.map((w, idx) => (
                  <span
                    key={idx}
                    className={
                      idx === currentChunk.focusIndex
                        ? 'text-blue-400 drop-shadow'
                        : 'text-slate-100/80'
                    }
                  >
                    {w}
                  </span>
                ))}
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
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{Math.round(progress)}% complete</span>
                <span>
                  {minutesRemaining < 1 ? '<1' : Math.round(minutesRemaining)} min remaining
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={skipBackward}
                  disabled={currentIndex === 0}
                  className="px-3 py-2 text-sm rounded-md border border-slate-600 hover:bg-slate-800 disabled:opacity-40"
                >
                  ⬅ Skip Back
                </button>
                <button
                  onClick={() => setIsPlaying(p => !p)}
                  className="px-4 py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium"
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button
                  onClick={skipForward}
                  disabled={currentIndex === safeChunks.length - 1}
                  className="px-3 py-2 text-sm rounded-md border border-slate-600 hover:bg-slate-800 disabled:opacity-40"
                >
                  Skip Forward ➡
                </button>
                <button
                  onClick={restart}
                  className="px-3 py-2 text-sm rounded-md border border-slate-600 hover:bg-slate-800"
                >
                  ⟲ Restart
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Reading speed</span>
                  <span className="text-3xl font-semibold text-blue-400">{safeWpm}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={1000}
                  step={50}
                  value={safeWpm}
                  onChange={e => setWpm(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex gap-2">
                  {[300, 500, 700].map(spd => (
                    <button
                      key={spd}
                      onClick={() => setWpm(spd)}
                      className={`flex-1 px-3 py-1.5 text-sm rounded-md border ${
                        safeWpm === spd
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'border-slate-600 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {spd} WPM
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500">
              Keyboard: Space = Play/Pause • ← / → = Skip • R = Restart • {wordsRead}/{totalWords}{' '}
              words read
            </p>
          </div>
        )}

        {/* Input dialog */}
        {showInput && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl mx-4 rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-2">Start a New Reading Session</h2>

              <div className="flex gap-2 text-sm mb-2">
                <button
                  className="px-3 py-1.5 rounded-md bg-blue-500 text-white"
                  onClick={() => setInputText(SAMPLE_TEXT)}
                >
                  Load Sample Text
                </button>
              </div>

              <textarea
                placeholder="Paste your text here…"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="w-full min-h-[180px] rounded-md border border-slate-700 bg-slate-950/60 text-sm px-3 py-2 text-slate-100"
              />

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  {inputText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleParse}
                    disabled={isParsing}
                    className="px-3 py-1.5 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                  >
                    {isParsing ? 'Parsing…' : 'Start Reading'}
                  </button>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-800 pt-4 space-y-3">
                <p className="text-xs text-slate-400">Or upload an image with text:</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="text-xs text-slate-300"
                />
                {isParsing && (
                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${ocrProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">{ocrProgress}%</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-2">
                <button
                  onClick={() => {
                    if (chunks.length > 0) {
                      setShowInput(false);
                    } else {
                      handleNewText();
                    }
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
