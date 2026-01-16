import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Sparkle, FileText, Brain, ListChecks } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { generateSummary, explainSimpler, generateFlashcards, generateQuiz } from '../lib/ai-service';
import { Flashcard, Quiz } from '../lib/types';
import { Textarea } from './ui/textarea';

interface AiStudyToolsProps {
  fullText: string;
  documentTitle?: string;
  onFlashcardsGenerated?: (flashcards: Flashcard[]) => void;
  onQuizGenerated?: (quiz: Quiz) => void;
}

export const AiStudyTools: React.FC<AiStudyToolsProps> = ({
  fullText,
  documentTitle = 'Document',
  onFlashcardsGenerated,
  onQuizGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState('');
  const [explanation, setExplanation] = useState('');
  const [activeView, setActiveView] = useState<'summary' | 'explain' | 'flashcards' | 'quiz' | null>(null);

  const handleGenerateSummary = async () => {
    if (!fullText.trim()) {
      toast.error('No text available to summarize');
      return;
    }

    setIsGenerating(true);
    setActiveView('summary');
    
    try {
      const result = await generateSummary(fullText);
      setSummary(result);
      toast.success('Summary generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExplainSimpler = async () => {
    if (!fullText.trim()) {
      toast.error('No text available to explain');
      return;
    }

    setIsGenerating(true);
    setActiveView('explain');
    
    try {
      const result = await explainSimpler(fullText);
      setExplanation(result);
      toast.success('Explanation generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate explanation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!fullText.trim()) {
      toast.error('No text available for flashcards');
      return;
    }

    setIsGenerating(true);
    setActiveView('flashcards');
    
    try {
      const flashcards = await generateFlashcards(fullText, 'current-doc');
      if (flashcards.length > 0) {
        onFlashcardsGenerated?.(flashcards);
        toast.success(`Generated ${flashcards.length} flashcards!`);
      } else {
        toast.error('No flashcards generated');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate flashcards');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!fullText.trim()) {
      toast.error('No text available for quiz');
      return;
    }

    setIsGenerating(true);
    setActiveView('quiz');
    
    try {
      const quiz = await generateQuiz(fullText, 'current-doc', `${documentTitle} Quiz`);
      if (quiz) {
        onQuizGenerated?.(quiz);
        toast.success(`Generated quiz with ${quiz.questions.length} questions!`);
      } else {
        toast.error('No quiz generated');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-slate-900/70 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Sparkle size={24} weight="duotone" />
          AI Study Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FileText size={18} />
            Summarize
          </Button>
          
          <Button
            onClick={handleExplainSimpler}
            disabled={isGenerating}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Brain size={18} />
            Explain
          </Button>
          
          <Button
            onClick={handleGenerateFlashcards}
            disabled={isGenerating}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ListChecks size={18} />
            Flashcards
          </Button>
          
          <Button
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ListChecks size={18} />
            Quiz
          </Button>
        </div>

        {isGenerating && (
          <div className="text-center text-sm text-slate-400 py-4">
            Generating with AI...
          </div>
        )}

        {activeView === 'summary' && summary && !isGenerating && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-300">Summary:</div>
            <Textarea
              value={summary}
              readOnly
              className="min-h-[160px] bg-slate-950/60 border-slate-700 text-slate-100 font-normal"
            />
          </div>
        )}

        {activeView === 'explain' && explanation && !isGenerating && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-300">Simplified Explanation:</div>
            <Textarea
              value={explanation}
              readOnly
              className="min-h-[160px] bg-slate-950/60 border-slate-700 text-slate-100 font-normal"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
