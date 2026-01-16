export interface SavedDocument {
  id: string;
  title: string;
  text: string;
  wordCount: number;
  createdAt: number;
  lastReadAt?: number;
  progress?: number;
  wpm?: number;
}

export interface Flashcard {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  createdAt: number;
}

export interface Quiz {
  id: string;
  documentId: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface UserSettings {
  defaultWpm: number;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
}
