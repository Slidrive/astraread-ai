export interface TextChunk {
  id: string;
  words: string[];
  focusIndex: number;
}

const MAX_WORDS_PER_CALL = 500;
const MAX_RETRIES = 2;

export async function parseTextIntoChunks(text: string): Promise<TextChunk[]> {
  const cleanText = sanitizeText(text);
  const words = cleanText.split(" ").filter(Boolean);

  if (words.length === 0) return [];

  if (words.length <= MAX_WORDS_PER_CALL) {
    const chunks = await parseWithLLM(words);
    return chunks.map((chunk, i) => ({ ...chunk, id: `chunk-${i}` }));
  }

  const allChunks: TextChunk[] = [];
  for (let i = 0; i < words.length; i += MAX_WORDS_PER_CALL) {
    const slice = words.slice(i, i + MAX_WORDS_PER_CALL);
    const sliceChunks = await parseWithLLM(slice);
    allChunks.push(...sliceChunks);
  }

  return allChunks.map((chunk, i) => ({
    ...chunk,
    id: `chunk-${i}`,
  }));
}

function sanitizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ").replace(/[`]/g, "");
}

async function parseWithLLM(words: string[]): Promise<TextChunk[]> {
  const text = words.join(" ");

  const promptText = `You are a text chunking expert for speed reading applications. Your task is to break the following text into optimal reading chunks.

Rules:
1. Each chunk should contain 1-3 words that form a natural semantic unit.
2. Keep phrases together (e.g., "in the morning", "as a result", "on the other hand").
3. Keep prepositional phrases intact.
4. Keep noun phrases together.
5. Keep short subject-verb pairs together.
6. The focus word in each chunk should be the most important word (usually a noun or verb).
7. Aim for an average of about 1.8 words per chunk.

Text:
${text}

Return ONLY a JSON object with a single property "chunks" containing an array of objects.
Each object must have:
- "words": array of strings (the words in this chunk)
- "focusIndex": number (0-based index of the most important word in the chunk)

Example format:
{
  "chunks": [
    { "words": ["The", "cat"], "focusIndex": 1 },
    { "words": ["sat"], "focusIndex": 0 },
    { "words": ["on", "the", "mat"], "focusIndex": 2 }
  ]
}`;

  if (!window || !("spark" in window) || typeof window.spark?.llm !== "function") {
    console.warn("spark.llm not available; using fallback chunking.");
    return fallbackChunking(words);
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await window.spark.llm(promptText, "gpt-4o-mini", true);
      const parsed = safeJsonParse(response);

      if (!parsed || !Array.isArray(parsed.chunks)) {
        throw new Error("Invalid LLM response format");
      }

      const result: TextChunk[] = parsed.chunks.map((chunk: any, index: number) => {
        const chunkWords = validateWords(chunk.words);
        const focusIndex = validateFocusIndex(chunkWords, chunk.focusIndex);
        return {
          id: `chunk-${index}`,
          words: chunkWords,
          focusIndex,
        };
      });

      if (result.length === 0) {
        throw new Error("No chunks returned by LLM");
      }

      return result;
    } catch (error) {
      console.error(`LLM parsing failed (attempt ${attempt + 1}):`, error);
      if (attempt === MAX_RETRIES) {
        console.warn("Max retries reached, falling back to simple chunking.");
        return fallbackChunking(words);
      }
    }
  }

  return fallbackChunking(words);
}

function safeJsonParse(input: string): any {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function validateWords(rawWords: any): string[] {
  if (!Array.isArray(rawWords)) return [];
  return rawWords.map(w => String(w).trim()).filter(Boolean);
}

function validateFocusIndex(words: string[], rawIndex: any): number {
  if (!words.length) return 0;
  const index = typeof rawIndex === "number" ? rawIndex : 0;
  if (index < 0 || index >= words.length) return words.length - 1;
  return index;
}

function fallbackChunking(words: string[]): TextChunk[] {
  const chunks: TextChunk[] = [];
  let i = 0;

  while (i < words.length) {
    const word = words[i];
    const nextWord = words[i + 1];

    if (
      nextWord &&
      (
        ["the", "a", "an", "in", "on", "at", "to", "for", "of", "with"].includes(
          word.toLowerCase()
        ) ||
        word.length <= 3
      )
    ) {
      chunks.push({
        id: `chunk-${chunks.length}`,
        words: [word, nextWord],
        focusIndex: 1,
      });
      i += 2;
    } else {
      chunks.push({
        id: `chunk-${chunks.length}`,
        words: [word],
        focusIndex: 0,
      });
      i += 1;
    }
  }

  return chunks;
}
