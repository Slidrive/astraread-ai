export interface TextChunk {
  id: string;
  words: string[];
  focusIndex: number;
}

export async function parseTextIntoChunks(text: string): Promise<TextChunk[]> {
  const cleanText = text.trim().replace(/\s+/g, ' ');
  const words = cleanText.split(' ').filter(w => w.length > 0);

  if (words.length === 0) return [];

  // For now we just use fallback; later Spark can wire in LLM chunking.
  return fallbackChunking(words);
}

export function fallbackChunking(words: string[]): TextChunk[] {
  const chunks: TextChunk[] = [];
  let i = 0;

  while (i < words.length) {
    const word = words[i];
    const nextWord = words[i + 1];

    if (
      nextWord &&
      (['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with'].includes(word.toLowerCase()) ||
        word.length <= 3)
    ) {
      chunks.push({
        id: `chunk-${chunks.length}`,
        words: [word, nextWord],
        focusIndex: 1
      });
      i += 2;
    } else {
      chunks.push({
        id: `chunk-${chunks.length}`,
        words: [word],
        focusIndex: 0
      });
      i += 1;
    }
  }

  return chunks;
}
