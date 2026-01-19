export interface SavedDocument {
  title: stri
  title: string;
  text: string;
  lastReadAt?: number;
  wpm?: number;
  bookmarks?: Bookmark[];
}

export interface Bookmark {
  id: string;
  chunkIndex: number;
  note?: string;
  createdAt: number;
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

export interface ReadingGoal {
  dailyWordTarget: number;
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string;
  wordsReadToday: number;
  totalWordsRead: number;
}
  lastReadAt?: number;
  wpm?: number;
  bookmarks?: Bookmark[];
}

export interface Bookmark {
  id: string;
  chunkIndex: number;
  note?: string;
  createdAt: number;
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

export interface ReadingGoal {
  dailyWordTarget: number;
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string;
  wordsReadToday: number;
  totalWordsRead: number;
}
