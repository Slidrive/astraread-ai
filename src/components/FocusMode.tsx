import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { TextChunk } from '@/lib/types';
import { X, Pause, Play, ArrowLeft, ArrowRight, ArrowCounterClockwise } from '@phosphor-icons/react';

interface FocusModeProps {
  chunks: TextChunk[];
  initialIndex: number;
  wpm: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function FocusMode({ chunks, initialIndex, wpm, onClose, onIndexChange }: FocusModeProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentChunk = chunks[currentIndex] || null;
  const progress = chunks.length > 0 ? (currentIndex / chunks.length) * 100 : 0;
  const totalWords = chunks.reduce((acc, c) => acc + c.words.length, 0);
  const wordsRead = chunks.slice(0, currentIndex).reduce((acc, c) => acc + c.words.length, 0);
  const wordsRemaining = totalWords - wordsRead;
  const minutesRemaining = wordsRemaining > 0 ? wordsRemaining / wpm : 0;

  useEffect(() => {
    if (!isPlaying || !currentChunk) return;

    const msPerChunk = (60000 / wpm) * currentChunk.words.length;
    const timer = setTimeout(() => {
      if (currentIndex < chunks.length - 1) {
        setCurrentIndex(currentIndex + 1);
        onIndexChange(currentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }, msPerChunk);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, chunks, wpm, currentChunk, onIndexChange]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsPlaying(p => !p);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentIndex > 0) {
            const newIndex = Math.max(0, currentIndex - 10);
            setCurrentIndex(newIndex);
            onIndexChange(newIndex);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentIndex < chunks.length - 1) {
            const newIndex = Math.min(chunks.length - 1, currentIndex + 10);
            setCurrentIndex(newIndex);
            onIndexChange(newIndex);
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setCurrentIndex(0);
          onIndexChange(0);
          setIsPlaying(false);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIndex, chunks.length, onClose, onIndexChange]);

  const handleSkipForward = () => {
    const newIndex = Math.min(chunks.length - 1, currentIndex + 10);
    setCurrentIndex(newIndex);
    onIndexChange(newIndex);
  };

  const handleSkipBackward = () => {
    const newIndex = Math.max(0, currentIndex - 10);
    setCurrentIndex(newIndex);
    onIndexChange(newIndex);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    onIndexChange(0);
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-slate-200"
        >
          <X size={24} />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center px-8">
        {currentChunk ? (
          <div className="max-w-5xl w-full text-center space-y-8">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {isPlaying ? 'Reading' : 'Paused'}
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {currentChunk.words.map((w, idx) => (
                <span
                  key={idx}
                  className={
                    idx === currentChunk.focusIndex
                      ? 'text-blue-400 drop-shadow-lg reading-focus word-transition'
                      : 'text-slate-300/60 word-transition'
                  }
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-lg">No content</p>
        )}
      </div>

      <div className="border-t border-slate-800 bg-slate-900/80 backdrop-blur p-6 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="space-y-2">
            <Progress value={Math.min(100, Math.max(0, progress))} className="h-1" />
            <div className="flex justify-between text-xs text-slate-500">
              <span>{Math.round(progress)}%</span>
              <span>
                {minutesRemaining < 1 ? '<1' : Math.round(minutesRemaining)} min • {wpm} WPM
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={handleSkipBackward}
              disabled={currentIndex === 0}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            
            <Button
              onClick={() => setIsPlaying(p => !p)}
              size="lg"
              className="gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause size={20} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={20} />
                  Play
                </>
              )}
            </Button>

            <Button
              onClick={handleSkipForward}
              disabled={currentIndex === chunks.length - 1}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              Forward
              <ArrowRight size={16} />
            </Button>

            <Button
              onClick={handleRestart}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ArrowCounterClockwise size={16} />
              Restart
            </Button>
          </div>

          <p className="text-center text-xs text-slate-500">
            Press Space to play/pause • Esc to exit focus mode • {wordsRead}/{totalWords} words
          </p>
        </div>
      </div>
    </div>
  );
}
