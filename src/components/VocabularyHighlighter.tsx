import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { BookOpen, Sparkle } from '@phosphor-icons/react';
import { VocabularyWord } from '@/lib/types';

interface VocabularyHighlighterProps {
  text: string;
  onClose?: () => void;
}

export function VocabularyHighlighter({ text, onClose }: VocabularyHighlighterProps) {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  const analyzeVocabulary = async () => {
    if (!text) {
      toast.error('No text to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const prompt = window.spark.llmPrompt`Analyze this text and identify 8-12 interesting, advanced, or potentially difficult vocabulary words. For each word provide a concise definition, difficulty level (easy/medium/hard), and 1-2 brief example sentences.

Text: ${text}

Return your response as a JSON object with a single property "words" that contains an array of word objects in this format:
{
  "words": [
    {
      "word": "example",
      "definition": "a thing characteristic of its kind or illustrating a general rule",
      "difficulty": "medium",
      "examples": ["This painting is a fine example of modern art.", "Let me give you an example."]
    }
  ]
}`;

      const response = await window.spark.llm(prompt, 'gpt-4o-mini', true);
      const parsed = JSON.parse(response);
      
      if (parsed.words && Array.isArray(parsed.words)) {
        setVocabulary(parsed.words);
        toast.success(`Found ${parsed.words.length} vocabulary words`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze vocabulary');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Card className="bg-slate-900/70 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={24} className="text-blue-400" />
            Vocabulary Analysis
          </CardTitle>
          {onClose && (
            <Button onClick={onClose} variant="ghost" size="sm">
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {vocabulary.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <Sparkle size={48} className="mx-auto text-slate-400" />
            <p className="text-slate-400 text-sm">
              Analyze your text to discover interesting vocabulary words with definitions and examples.
            </p>
            <Button onClick={analyzeVocabulary} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze Vocabulary'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Found {vocabulary.length} words
              </p>
              <Button onClick={analyzeVocabulary} disabled={isAnalyzing} size="sm" variant="outline">
                {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {vocabulary.map((word, index) => (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedWord(selectedWord?.word === word.word ? null : word)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-200">{word.word}</h3>
                      <Badge className={getDifficultyColor(word.difficulty)}>
                        {word.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-300">{word.definition}</p>
                    
                    {selectedWord?.word === word.word && word.examples.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                        <p className="text-xs uppercase tracking-wider text-slate-500">Examples:</p>
                        {word.examples.map((example, idx) => (
                          <p key={idx} className="text-sm text-slate-400 italic">
                            "{example}"
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
