import { Flashcard, Quiz, QuizQuestion } from './types';

export async function generateSummary(text: string): Promise<string> {
  const prompt = spark.llmPrompt`You are a helpful reading assistant.
The user is studying the following text:

${text}

Task:
- Provide a concise summary in 3-7 bullet points
- Use simple, clear language
- Focus on the main ideas and key details only

Return ONLY the bullet points, one per line, starting with a dash (-).`;

  const result = await spark.llm(prompt, "gpt-4o-mini", false);
  return result.trim();
}

export async function explainSimpler(text: string): Promise<string> {
  const prompt = spark.llmPrompt`You are an assistant helping someone understand a difficult passage.

Text:
${text}

Task:
- Explain this in much simpler language
- Assume the reader is smart but not familiar with technical terms
- Use short sentences and plain words
- If there are key terms, briefly define them

Return your explanation as plain text.`;

  const result = await spark.llm(prompt, "gpt-4o-mini", false);
  return result.trim();
}

export async function generateFlashcards(
  text: string,
  documentId: string
): Promise<Flashcard[]> {
  const prompt = spark.llmPrompt`You are creating study flashcards from the following text:

${text}

Task:
- Generate flashcards in JSON format
- Each flashcard should have "question" and "answer"
- Focus on key concepts, definitions, and important facts
- Create 5-10 flashcards depending on content length

Return ONLY a JSON object with a single property "flashcards" that contains an array of objects.
Format:
{
  "flashcards": [
    { "question": "What is...", "answer": "..." },
    { "question": "Define...", "answer": "..." }
  ]
}`;

  try {
    const result = await spark.llm(prompt, "gpt-4o-mini", true);
    const parsed = JSON.parse(result);

    if (!parsed.flashcards || !Array.isArray(parsed.flashcards)) {
      throw new Error('Invalid flashcard format');
    }

    return parsed.flashcards.map((fc: any, idx: number) => ({
      id: `fc-${Date.now()}-${idx}`,
      documentId,
      question: fc.question || '',
      answer: fc.answer || '',
      createdAt: Date.now(),
    }));
  } catch (error) {
    console.error('Failed to generate flashcards:', error);
    return [];
  }
}

export async function generateQuiz(
  text: string,
  documentId: string,
  title: string = 'Reading Comprehension Quiz'
): Promise<Quiz | null> {
  const prompt = spark.llmPrompt`You are creating a short quiz from the following text:

${text}

Task:
- Create a quiz with 5 multiple-choice questions
- Each question should have:
  - "question": string
  - "options": array of 4 strings (A, B, C, D)
  - "correctIndex": number (0-3)
- Focus on comprehension, not trick questions

Return ONLY a JSON object with a single property "questions" that contains an array.
Format:
{
  "questions": [
    {
      "question": "What is the main idea?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1
    }
  ]
}`;

  try {
    const result = await spark.llm(prompt, "gpt-4o-mini", true);
    const parsed = JSON.parse(result);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid quiz format');
    }

    const questions: QuizQuestion[] = parsed.questions.map((q: any) => ({
      question: q.question || '',
      options: Array.isArray(q.options) ? q.options : [],
      correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
    }));

    return {
      id: `quiz-${Date.now()}`,
      documentId,
      title,
      questions,
      createdAt: Date.now(),
    };
  } catch (error) {
    console.error('Failed to generate quiz:', error);
    return null;
  }
}

export async function answerQuestion(
  question: string,
  contextText: string
): Promise<string> {
  const prompt = spark.llmPrompt`You are a helpful reading tutor. Answer the user's question based on the following text.

Text:
${contextText}

User's Question:
${question}

Provide a clear, concise answer based on the text. If the answer isn't in the text, say so politely.`;

  const result = await spark.llm(prompt, "gpt-4o-mini", false);
  return result.trim();
}
