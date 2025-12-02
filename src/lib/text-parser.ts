export interface TextChunk {
  id: string;
  words: string[];
  focusIndex: number;
}

export async function parseTextIntoChunks(text: string): Promise<TextChunk[]> {
  const cleanText = text.trim().replace(/\s+/g, ' ');
  const words = cleanText.split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return [];
  
  if (words.length <= 500) {
    return await parseWithLLM(words);
  } else {
    const chunkSize = 500;
    const allChunks: TextChunk[] = [];
    
    for (let i = 0; i < words.length; i += chunkSize) {
      const slice = words.slice(i, i + chunkSize);
      const chunks = await parseWithLLM(slice);
      allChunks.push(...chunks);
    }
    
    return allChunks;
  }
}

async function parseWithLLM(words: string[]): Promise<TextChunk[]> {
  try {
    const text = words.join(' ');
    const prompt = `You are a text chunking expert for speed reading applications. Your task is to break the following text into optimal reading chunks.

Rules:
1. Each chunk should contain 1-3 words that form a natural semantic unit
2. Keep phrases together (e.g., "in the morning", "as a result", "on the other hand")
3. Keep prepositional phrases intact
4. Keep noun phrases together
5. Keep subject-verb pairs when short
6. The focus word in each chunk should be the most important word (usually a noun or verb)
7. Aim for an average of 1.8 words per chunk

Text: ${text}

Return a JSON object with a single property "chunks" containing an array of objects. Each object should have:
- words: array of strings (the words in this chunk)
- focusIndex: number (0-based index of the most important word in the chunk)

Example format:
{
  "chunks": [
    {"words": ["The", "cat"], "focusIndex": 1},
    {"words": ["sat"], "focusIndex": 0},
    {"words": ["on", "the", "mat"], "focusIndex": 2}
  ]
}`;

    const response = await window.spark.llm(prompt, 'gpt-4o-mini', true);
    const parsed = JSON.parse(response);
    
    return parsed.chunks.map((chunk: any, index: number) => ({
      id: `chunk-${index}`,
      words: chunk.words,
      focusIndex: chunk.focusIndex
    }));
  } catch (error) {
    console.error('LLM parsing failed, falling back to simple chunking:', error);
    return fallbackChunking(words);
  }
}

function fallbackChunking(words: string[]): TextChunk[] {
  const chunks: TextChunk[] = [];
  let i = 0;
  
  while (i < words.length) {
    const word = words[i];
    const nextWord = words[i + 1];
    
    if (nextWord && (
      ['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with'].includes(word.toLowerCase()) ||
      word.length <= 3
    )) {
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
