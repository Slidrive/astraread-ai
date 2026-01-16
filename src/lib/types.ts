export interface SavedDocument {
  id: string;
  title: string;
  text: string;
  lastReadAt?: number;
  wpm?: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface Quiz {
  id: string;
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
