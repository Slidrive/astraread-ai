import { useState } from 'react';
import { Button } from './ui/button';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { VocabularyWord } from 
import { BookOpen, Sparkle } from '@phosphor-icons/react';
import { VocabularyWord } from '@/lib/types';

  const [selectedWord, setSelectedWord
  const analyze
      toast.error('No t
 

      const prompt = window.spark.llmPrompt`Analyze this text and identify 8-12 intere
Text: ${text}
Return your response as a JSON object with a single prop
  "words": [

      "difficulty": "medium",
    }
}`;
      const r
     

      } else {
      }
      console.error(error);

    }

    switch (difficulty) {
 
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
                        <p className="text-xs uppercase tracking-wider 
                  
                          </p>
              
                  </CardContent>
     
    

  );









































































