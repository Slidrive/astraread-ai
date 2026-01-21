import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { BookOpen, Sparkle } from '@phosphor-icons/react';
import { VocabularyWord } from '@/lib/types';
import { toast } from 'sonner';

interface VocabularyHighlighterProps {
  text: string;
  onClose?: () => void;
}

export function VocabularyHighlighter({ text, onClose }: VocabularyHighlighterProps) {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  const analyzeVocabulary = async () => {
    if (!text.trim()) {
      toast.error('No text to analyze');
      return;
    }

    setIsAnalyzing(true);

    try {
      const prompt = window.spark.llmPrompt`Analyze this text and identify 8-12 interesting vocabulary words that would be valuable for learning. Include a mix of difficulty levels.

Text: ${text}

Return your response as a JSON object with a single property "words" that contains an array of vocabulary items. Each item should have:
- word: the vocabulary word
- definition: clear definition
- difficulty: "easy", "medium", or "hard"
- examples: array of 2-3 example sentences using the word

Format example:
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

      const response = await spark.llm(prompt, 'gpt-4o-mini', true);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={24} className="text-blue-400" />
          <p className="text-sm text-slate-300">
            Discover and learn important vocabulary from your text
          </p>
        </div>
        <Button
          onClick={analyzeVocabulary}
          disabled={isAnalyzing}
          size="sm"
        >
          <Sparkle size={16} className="mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Vocabulary'}
        </Button>
      </div>

      {vocabulary.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {vocabulary.map((word, idx) => (
                <Card
                  key={idx}
                  className={`cursor-pointer transition-all hover:border-blue-500/50 ${
                    selectedWord?.word === word.word ? 'border-blue-500' : 'border-slate-700'
                  } bg-slate-900/70`}
                  onClick={() => setSelectedWord(word)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-100">{word.word}</h3>
                      <Badge className={`${getDifficultyColor(word.difficulty)} border`}>
                        {word.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300">{word.definition}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <div>
            {selectedWord ? (
              <Card className="bg-slate-900/70 border-slate-700 sticky top-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedWord.word}</span>
                    <Badge className={`${getDifficultyColor(selectedWord.difficulty)} border`}>
                      {selectedWord.difficulty}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Definition</p>
                    <p className="text-slate-200">{selectedWord.definition}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Examples</p>
                    <ul className="space-y-2">
                      {selectedWord.examples.map((example, idx) => (
                        <li key={idx} className="text-sm text-slate-300 pl-4 border-l-2 border-blue-500/30">
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-900/70 border-slate-700">
                <CardContent className="p-8 text-center">
                  <BookOpen size={48} className="mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400">Select a word to see details and examples</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card className="bg-slate-900/70 border-slate-700">
          <CardContent className="p-8 text-center">
            <BookOpen size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 mb-4">
              Click "Analyze Vocabulary" to discover important words in your text
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
