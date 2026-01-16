import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Flashcard } from '../lib/types';

interface FlashcardViewerProps {
  flashcards: Flashcard[];
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (flashcards.length === 0) {
    return (
      <Card className="bg-slate-900/70 border-slate-800">
        <CardContent className="py-8 text-center text-slate-400">
          No flashcards yet. Generate some using AI Study Tools!
        </CardContent>
      </Card>
    );
  }

  const current = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <Card className="bg-slate-900/70 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Flashcards</span>
          <span className="text-sm font-normal text-slate-400">
            {currentIndex + 1} / {flashcards.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="min-h-[200px] flex items-center justify-center p-8 bg-slate-950/60 rounded-lg border border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
        >
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-3">
              {isFlipped ? 'Answer' : 'Question'}
            </div>
            <div className="text-lg text-slate-100">
              {isFlipped ? current.answer : current.question}
            </div>
            {!isFlipped && (
              <div className="text-xs text-slate-500 mt-4">
                Click to reveal answer
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="sm"
            disabled={flashcards.length <= 1}
          >
            ← Previous
          </Button>
          <Button
            onClick={() => setIsFlipped(!isFlipped)}
            variant="default"
            size="sm"
          >
            Flip Card
          </Button>
          <Button
            onClick={handleNext}
            variant="outline"
            size="sm"
            disabled={flashcards.length <= 1}
          >
            Next →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
