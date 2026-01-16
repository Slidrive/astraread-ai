import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Quiz } from '../lib/types';
import { toast } from 'sonner';

interface QuizViewerProps {
  quiz: Quiz;
  onComplete?: (score: number) => void;
}

export const QuizViewer: React.FC<QuizViewerProps> = ({ quiz, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);

  if (quiz.questions.length === 0) {
    return (
      <Card className="bg-slate-900/70 border-slate-800">
        <CardContent className="py-8 text-center text-slate-400">
          No quiz questions available.
        </CardContent>
      </Card>
    );
  }

  const current = quiz.questions[currentIndex];

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswers.some((a) => a === null)) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setShowResults(true);

    const correctCount = quiz.questions.filter(
      (q, i) => selectedAnswers[i] === q.correctIndex
    ).length;

    const score = (correctCount / quiz.questions.length) * 100;
    onComplete?.(score);
    toast.success(`Quiz complete! Score: ${score.toFixed(0)}%`);
  };

  const calculateScore = () => {
    const correctCount = quiz.questions.filter(
      (q, i) => selectedAnswers[i] === q.correctIndex
    ).length;
    return (correctCount / quiz.questions.length) * 100;
  };

  return (
    <Card className="bg-slate-900/70 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{quiz.title}</span>
          <span className="text-sm font-normal text-slate-400">
            Question {currentIndex + 1} / {quiz.questions.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showResults ? (
          <>
            <div className="space-y-4">
              <div className="text-lg font-medium text-slate-100">
                {current.question}
              </div>

              <div className="space-y-2">
                {current.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswers[currentIndex] === optionIndex;

                  return (
                    <button
                      key={optionIndex}
                      onClick={() => handleSelectAnswer(optionIndex)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-slate-200">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 justify-between pt-4">
              <Button
                onClick={handlePrevious}
                variant="outline"
                size="sm"
                disabled={currentIndex === 0}
              >
                ← Previous
              </Button>

              {currentIndex === quiz.questions.length - 1 ? (
                <Button onClick={handleSubmit} size="sm">
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="outline"
                  size="sm"
                  disabled={selectedAnswers[currentIndex] === null}
                >
                  Next →
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {calculateScore().toFixed(0)}%
              </div>
              <div className="text-slate-400">
                {quiz.questions.filter((q, i) => selectedAnswers[i] === q.correctIndex).length}{' '}
                / {quiz.questions.length} correct
              </div>
            </div>

            <div className="space-y-3">
              {quiz.questions.map((q, i) => {
                const userAnswer = selectedAnswers[i];
                const isCorrect = userAnswer === q.correctIndex;

                return (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border ${
                      isCorrect ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'
                    }`}
                  >
                    <div className="text-sm font-medium text-slate-300 mb-2">
                      {i + 1}. {q.question}
                    </div>
                    <div className="text-xs space-y-1">
                      <div className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                        Your answer: {userAnswer !== null ? q.options[userAnswer] : 'No answer'}
                      </div>
                      {!isCorrect && (
                        <div className="text-green-400">
                          Correct answer: {q.options[q.correctIndex]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => {
                setShowResults(false);
                setCurrentIndex(0);
                setSelectedAnswers(new Array(quiz.questions.length).fill(null));
              }}
              className="w-full"
            >
              Retake Quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
