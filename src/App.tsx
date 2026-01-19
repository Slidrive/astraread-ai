import React, { useEffect, useRef, useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { parseTextIntoChunks, TextChunk } from './lib/text-parser';
import { runOcrOnFile } from './lib/ocr-service';
import { Toaster, toast } from 'sonner';
import { Button } from './components/ui/button';
import { Slider } from './components/ui/slider';
import { Progress } from './components/ui/progress';
import { Textarea } from './components/ui/textarea';
import { Card, CardContent } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Alert, AlertDescription } from './components/ui/alert';
import { AiStudyTools } from './components/AiStudyTools';
import { FlashcardViewer } from './components/FlashcardViewer';
import { QuizViewer } from './components/QuizViewer';
import { DocumentLibrary } from './components/DocumentLibrary';
import { ReadingStats } from './components/ReadingStats';
import { DocumentChat } from './components/DocumentChat';
import { BookmarksManager } from './components/BookmarksManager';
import { ReadingGoals } from './components/ReadingGoals';
import { TextToSpeech } from './components/TextToSpeech';
import { VocabularyHighlighter } from './components/VocabularyHighlighter';
import { ReadingHistoryCalendar } from './components/ReadingHistoryCalendar';
import { FocusMode } from './components/FocusMode';
import { Flashcard, Quiz, SavedDocument, Bookmark, ReadingGoal, ReadingSession } from './lib/types';
import { FolderOpen, ChartBar, Chat, BookmarkSimple, Target, SpeakerHigh, BookOpen, CalendarBlank, ArrowsOut } from '@phosphor-icons/react';

const MIN_WORD_COUNT = 10;
const OCR_CONFIDENCE_THRESHOLD = 60;
const TAB_TEXT_INPUT = 'text';
const TAB_IMAGE_UPLOAD = 'image';

const SAMPLE_TEXT = `Speed reading is a collection of techniques that aim to increase reading speed without greatly reducing comprehension or retention. Methods include skimming, meta guiding, and eliminating subvocalization. The many available speed reading training programs may utilize books, videos, software, and seminars. The most effective techniques often involve training the eyes to make shorter fixations and broader saccades across the text.

Research has shown that skilled readers can read at rates of up to 1000 words per minute, though average reading speeds are typically between 200 and 300 words per minute. The relationship between reading speed and comprehension is complex, with some studies suggesting that increasing speed beyond natural limits may reduce understanding and retention of material.

Modern speed reading applications leverage technology to present text in optimal ways for rapid consumption. By chunking text into meaningful phrases and highlighting focus words, these tools help readers maintain comprehension while dramatically increasing their reading pace. The key is finding the right balance between speed and understanding for each individual reader.`;

// Utility function to count words in text
const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [chunks, setChunks] = useState<TextChunk[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(500);
  const [showInput, setShowInput] = useState(true);
  const [isParsing, setIsParsing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>(TAB_TEXT_INPUT);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [showStudyTools, setShowStudyTools] = useState(false);
  
  const [savedDocuments, setSavedDocuments] = useKV<SavedDocument[]>('saved-documents', []);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const [bookmarks, setBookmarks] = useKV<Bookmark[]>('bookmarks', []);
  const [showBookmarks, setShowBookmarks] = useState(false);
  
  const [readingGoal, setReadingGoal] = useKV<ReadingGoal>('reading-goal', {
    dailyWordTarget: 2000,
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: new Date().toDateString(),
    wordsReadToday: 0,
    totalWordsRead: 0,
  });
  const [showGoals, setShowGoals] = useState(false);
  
  const [showTTS, setShowTTS] = useState(false);

  const [showVocabulary, setShowVocabulary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);

  const [readingHistory, setReadingHistory] = useKV<ReadingSession[]>('reading-history', []);

  const safeChunks = chunks || [];
  const safeWpm = wpm || 500;
  const currentChunk = safeChunks[currentIndex] || null;
  const progress = safeChunks.length > 0 ? (currentIndex / safeChunks.length) * 100 : 0;
  const totalWords = safeChunks.reduce((acc, c) => acc + c.words.length, 0);
  const wordsRead = safeChunks.slice(0, currentIndex).reduce((acc, c) => acc + c.words.length, 0);
  const wordsRemaining = totalWords - wordsRead;
  const minutesRemaining = wordsRemaining > 0 ? wordsRemaining / safeWpm : 0;

  useEffect(() => {
    if (!isPlaying || !currentChunk) return;

    const msPerChunk = (60000 / safeWpm) * currentChunk.words.length;
    const timer = setTimeout(() => {
      if (currentIndex < safeChunks.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsPlaying(false);
        toast.success('Reading complete!');
        
        const today = new Date().toDateString();
        setReadingHistory((currentHistory) => {
          const existingSession = currentHistory.find(s => s.date === today);
          if (existingSession) {
            return currentHistory.map(s =>
              s.date === today
                ? {
                    ...s,
                    wordsRead: s.wordsRead + totalWords,
                    documentsRead: s.documentsRead + 1,
                    avgWpm: Math.round((s.avgWpm * s.documentsRead + safeWpm) / (s.documentsRead + 1))
                  }
                : s
            );
          } else {
            return [...currentHistory, {
              date: today,
              wordsRead: totalWords,
              documentsRead: 1,
              avgWpm: safeWpm
            }];
          }
        });
      }
    }, msPerChunk);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, safeChunks, safeWpm, currentChunk]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (safeChunks.length > 0) {
            setIsPlaying(p => !p);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          restart();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [safeChunks.length, currentIndex]);

  const handleParse = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text');
      return;
    }
    const wordCount = getWordCount(inputText);
    if (wordCount < MIN_WORD_COUNT) {
      toast.error(`Please enter at least ${MIN_WORD_COUNT} words`);
      return;
    }

    setIsParsing(true);

    try {
      const parsed = await parseTextIntoChunks(inputText);
      setChunks(parsed);
      setCurrentIndex(0);
      setShowInput(false);
      const estimatedTime = Math.round(wordCount / safeWpm);
      
      const newDocId = `doc-${Date.now()}`;
      setCurrentDocumentId(newDocId);
      
      const newDocument: SavedDocument = {
        id: newDocId,
        title: inputText.substring(0, 50).trim() + (inputText.length > 50 ? '...' : ''),
        text: inputText,
        lastReadAt: Date.now(),
        wpm: safeWpm,
      };
      
      setSavedDocuments((currentDocs: SavedDocument[]) => {
        const existingIndex = currentDocs.findIndex((d: SavedDocument) => d.text === inputText);
        if (existingIndex >= 0) {
          const updated = [...currentDocs];
          updated[existingIndex] = { ...updated[existingIndex], lastReadAt: Date.now(), wpm: safeWpm };
          return updated;
        }
        return [...currentDocs, newDocument];
      });
      
      toast.success(`Text loaded successfully! Estimated reading time: ${estimatedTime} min`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse text. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsParsing(true);
    setOcrProgress(0);

    try {
      const { text, confidence } = await runOcrOnFile(file, 'eng', p => setOcrProgress(Math.round(p * 100)));
      if (!text) {
        toast.error('No text detected in image');
        return;
      }
      console.log(`OCR confidence: ${confidence}`);
      setOcrConfidence(confidence);
      setInputText(text);
      
      // Show warning if confidence is low
      if (confidence < OCR_CONFIDENCE_THRESHOLD) {
        toast.error(`Low OCR confidence (${confidence.toFixed(0)}%). Please review the extracted text.`);
      }
      
      const wordCount = getWordCount(text);
      const parsed = await parseTextIntoChunks(text);
      setChunks(parsed);
      setCurrentIndex(0);
      setShowInput(false);
      const estimatedTime = Math.round(wordCount / safeWpm);
      toast.success(`Text extracted successfully! (${confidence.toFixed(0)}% confidence) - Estimated reading time: ${estimatedTime} min`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsParsing(false);
      setOcrProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const skipForward = () => {
    if (currentIndex < safeChunks.length - 1) {
      setCurrentIndex(Math.min(safeChunks.length - 1, currentIndex + 10));
    }
  };

  const skipBackward = () => {
    if (currentIndex > 0) {
      setCurrentIndex(Math.max(0, currentIndex - 10));
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const handleNewText = () => {
    setIsPlaying(false);
    setShowInput(true);
    setInputText('');
    setChunks([]);
    setCurrentIndex(0);
    setOcrConfidence(null);
  };

  const handleAddBookmark = (chunkIndex: number, note?: string) => {
    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      chunkIndex,
      note,
      createdAt: Date.now(),
    };
    setBookmarks((currentBookmarks) => [...currentBookmarks, newBookmark]);
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    setBookmarks((currentBookmarks) => currentBookmarks.filter((b) => b.id !== bookmarkId));
  };

  const handleJumpToBookmark = (chunkIndex: number) => {
    setCurrentIndex(chunkIndex);
    setIsPlaying(false);
    toast.success(`Jumped to bookmark`);
  };

  const handleUpdateGoal = (newTarget: number) => {
    setReadingGoal((currentGoal) => ({
      ...currentGoal,
      dailyWordTarget: newTarget,
    }));
  };

  useEffect(() => {
    const today = new Date().toDateString();
    if (readingGoal.lastReadDate !== today) {
      const wasYesterday = new Date(readingGoal.lastReadDate);
      wasYesterday.setDate(wasYesterday.getDate() + 1);
      const isConsecutive = wasYesterday.toDateString() === today;

      setReadingGoal((currentGoal) => ({
        ...currentGoal,
        lastReadDate: today,
        wordsReadToday: 0,
        currentStreak: isConsecutive ? currentGoal.currentStreak : 0,
      }));
    }
  }, []);

  useEffect(() => {
    if (isPlaying && wordsRead > 0) {
      const newWordsRead = wordsRead;
      setReadingGoal((currentGoal) => {
        const newWordsToday = currentGoal.wordsReadToday + 1;
        const newTotalWords = currentGoal.totalWordsRead + 1;
        
        const today = new Date().toDateString();
        let newStreak = currentGoal.currentStreak;
        let newLongestStreak = currentGoal.longestStreak;

        if (newWordsToday >= currentGoal.dailyWordTarget && currentGoal.wordsReadToday < currentGoal.dailyWordTarget) {
          newStreak = currentGoal.currentStreak + 1;
          newLongestStreak = Math.max(newStreak, currentGoal.longestStreak);
        }

        return {
          ...currentGoal,
          wordsReadToday: newWordsToday,
          totalWordsRead: newTotalWords,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastReadDate: today,
        };
      });
    }
  }, [wordsRead, isPlaying]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex flex-col">
      <Toaster position="top-center" richColors />
      <header className="border-b border-slate-800 bg-black/40 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            <span className="text-blue-400">LearningTheForce</span>{' '}
            <span className="text-slate-200">AI Reader</span>
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowGoals(true)}
              variant="outline"
              size="sm"
            >
              <Target size={16} className="mr-2" />
              Goals
            </Button>
            <Button
              onClick={() => setShowLibrary(true)}
              variant="outline"
              size="sm"
            >
              <FolderOpen size={16} className="mr-2" />
              Library
            </Button>
            {safeChunks.length > 0 && (
              <>
                <Button
                  onClick={() => setShowVocabulary(true)}
                  variant="outline"
                  size="sm"
                >
                  <BookOpen size={16} className="mr-2" />
                  Vocab
                </Button>
                <Button
                  onClick={() => setShowFocusMode(true)}
                  variant="outline"
                  size="sm"
                >
                  <ArrowsOut size={16} className="mr-2" />
                  Focus
                </Button>
                <Button
                  onClick={() => setShowBookmarks(true)}
                  variant="outline"
                  size="sm"
                >
                  <BookmarkSimple size={16} className="mr-2" />
                  Bookmarks
                </Button>
                <Button
                  onClick={() => setShowTTS(true)}
                  variant="outline"
                  size="sm"
                >
                  <SpeakerHigh size={16} className="mr-2" />
                  TTS
                </Button>
                <Button
                  onClick={() => setShowStats(true)}
                  variant="outline"
                  size="sm"
                >
                  <ChartBar size={16} className="mr-2" />
                  Stats
                </Button>
                <Button
                  onClick={() => setShowChat(true)}
                  variant="outline"
                  size="sm"
                >
                  <Chat size={16} className="mr-2" />
                  Q&A
                </Button>
              </>
            )}
            <Button
              onClick={() => setShowHistory(true)}
              variant="outline"
              size="sm"
            >
              <CalendarBlank size={16} className="mr-2" />
              History
            </Button>
            {safeChunks.length > 0 && (
              <Button
                onClick={handleNewText}
                variant="outline"
                size="sm"
              >
                New Text
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
        {/* Reading display */}
        <div className="min-h-[160px] flex items-center justify-center mb-8">
          {currentChunk ? (
            <div className="border border-slate-700 rounded-2xl px-8 py-6 bg-slate-900/80 shadow-lg max-w-3xl w-full text-center">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">
                {isPlaying ? 'Reading…' : 'Paused'}
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-3xl md:text-4xl lg:text-5xl font-semibold">
                {currentChunk.words.map((w, idx) => (
                  <span
                    key={idx}
                    className={
                      idx === currentChunk.focusIndex
                        ? 'text-blue-400 drop-shadow reading-focus word-transition'
                        : 'text-slate-100/80 word-transition'
                    }
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              Paste some text or upload an image to begin reading.
            </p>
          )}
        </div>

        {/* Controls & progress */}
        {safeChunks.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Progress value={Math.min(100, Math.max(0, progress))} className="h-2 bg-slate-800" />
              <div className="flex justify-between text-xs text-slate-400">
                <span>{Math.round(progress)}% complete</span>
                <span>
                  {minutesRemaining < 1 ? '<1' : Math.round(minutesRemaining)} min remaining
                </span>
              </div>
            </div>

            <Card className="bg-slate-900/70 border-slate-800">
              <CardContent className="space-y-6 pt-6">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    onClick={skipBackward}
                    disabled={currentIndex === 0}
                    variant="outline"
                    size="sm"
                  >
                    ⬅ Skip Back
                  </Button>
                  <Button
                    onClick={() => setIsPlaying(p => !p)}
                    size="default"
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                  </Button>
                  <Button
                    onClick={skipForward}
                    disabled={currentIndex === safeChunks.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    Skip Forward ➡
                  </Button>
                  <Button
                    onClick={restart}
                    variant="outline"
                    size="sm"
                  >
                    ⟲ Restart
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Reading speed</span>
                    <span className="text-3xl font-semibold text-blue-400">{safeWpm}</span>
                  </div>
                  <Slider
                    value={[safeWpm]}
                    onValueChange={values => setWpm(values[0])}
                    min={200}
                    max={1000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    {[300, 500, 700].map(spd => (
                      <Button
                        key={spd}
                        onClick={() => setWpm(spd)}
                        variant={safeWpm === spd ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                      >
                        {spd} WPM
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-slate-500">
              Keyboard: Space = Play/Pause • ← / → = Skip • R = Restart • {wordsRead}/{totalWords}{' '}
              words read
            </p>
          </div>
        )}

        {/* AI Study Tools Section */}
        {safeChunks.length > 0 && inputText && (
          <div className="space-y-6 mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-200">Study Tools</h2>
              <Button
                onClick={() => setShowStudyTools(!showStudyTools)}
                variant="outline"
                size="sm"
              >
                {showStudyTools ? 'Hide Tools' : 'Show AI Tools'}
              </Button>
            </div>

            {showStudyTools && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <AiStudyTools
                    fullText={inputText}
                    documentTitle="Current Reading"
                    onFlashcardsGenerated={(cards) => setFlashcards(cards)}
                    onQuizGenerated={(q) => setQuiz(q)}
                  />
                </div>

                <div className="space-y-6">
                  {flashcards.length > 0 && <FlashcardViewer flashcards={flashcards} />}
                  {quiz && <QuizViewer quiz={quiz} onComplete={(score) => toast.success(`Score: ${score}%`)} />}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input dialog */}
        <Dialog open={showInput} onOpenChange={setShowInput}>
          <DialogContent className="w-full max-w-2xl bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle>Start a New Reading Session</DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={TAB_TEXT_INPUT}>Text Input</TabsTrigger>
                <TabsTrigger value={TAB_IMAGE_UPLOAD}>Image Upload</TabsTrigger>
              </TabsList>

              <TabsContent value={TAB_TEXT_INPUT} className="space-y-4">
                <div className="flex gap-2 text-sm">
                  <Button
                    size="sm"
                    onClick={() => setInputText(SAMPLE_TEXT)}
                  >
                    Load Sample Text
                  </Button>
                </div>

                <Textarea
                  placeholder="Paste your text here…"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="min-h-[180px] bg-slate-950/60 border-slate-700 text-slate-100"
                />

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    {getWordCount(inputText)} words
                  </span>
                  <Button
                    onClick={handleParse}
                    disabled={isParsing}
                    size="sm"
                  >
                    {isParsing ? 'Parsing…' : 'Start Reading'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value={TAB_IMAGE_UPLOAD} className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Upload an image containing text. The OCR will extract the text automatically.
                  </AlertDescription>
                </Alert>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="text-xs text-slate-300 w-full"
                />

                {isParsing && (
                  <div className="space-y-1">
                    <Progress value={ocrProgress} className="h-2 bg-slate-800" />
                    <p className="text-xs text-slate-400">{ocrProgress}%</p>
                  </div>
                )}

                {ocrConfidence !== null && (
                  <Alert variant={ocrConfidence < OCR_CONFIDENCE_THRESHOLD ? 'destructive' : 'default'}>
                    <AlertDescription>
                      OCR Confidence: <strong className={ocrConfidence < OCR_CONFIDENCE_THRESHOLD ? 'text-red-400' : 'text-green-400'}>{ocrConfidence.toFixed(0)}%</strong>
                      {ocrConfidence < OCR_CONFIDENCE_THRESHOLD && ' - Low confidence, please review the text.'}
                    </AlertDescription>
                  </Alert>
                )}

                {inputText && activeTab === TAB_IMAGE_UPLOAD && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400">Extracted text ({getWordCount(inputText)} words):</p>
                    <Textarea
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      className="min-h-[120px] bg-slate-950/60 border-slate-700 text-slate-100"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleParse}
                        disabled={isParsing}
                        size="sm"
                      >
                        {isParsing ? 'Parsing…' : 'Start Reading'}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Document Library Dialog */}
        <Dialog open={showLibrary} onOpenChange={setShowLibrary}>
          <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle>Document Library</DialogTitle>
            </DialogHeader>
            <DocumentLibrary
              documents={savedDocuments}
              onLoadDocument={(doc) => {
                setInputText(doc.text);
                setWpm(doc.wpm || 500);
                handleParse();
                setShowLibrary(false);
              }}
              onDeleteDocument={(docId) => {
                setSavedDocuments((docs: SavedDocument[]) => docs.filter((d: SavedDocument) => d.id !== docId));
              }}
              onClose={() => setShowLibrary(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Reading Stats Dialog */}
        <Dialog open={showStats} onOpenChange={setShowStats}>
          <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle>Reading Statistics</DialogTitle>
            </DialogHeader>
            <ReadingStats
              totalWordsRead={wordsRead}
              currentWpm={wpm}
              sessionsToday={savedDocuments.filter((d: SavedDocument) => {
                const today = new Date().toDateString();
                return d.lastReadAt && new Date(d.lastReadAt).toDateString() === today;
              }).length}
              avgCompletionRate={progress}
              recentSessions={savedDocuments.slice(-10).map((d: SavedDocument) => ({
                timestamp: d.lastReadAt || Date.now(),
                wordsRead: getWordCount(d.text),
                avgWpm: d.wpm || 500,
                duration: Math.round((getWordCount(d.text) / (d.wpm || 500)) * 60),
              }))}
            />
          </DialogContent>
        </Dialog>

        {/* Q&A Chat Dialog */}
        <Dialog open={showChat} onOpenChange={setShowChat}>
          <DialogContent className="max-w-3xl bg-slate-900 border-slate-700">
            <DocumentChat
              documentText={inputText}
              documentTitle={currentDocumentId ? savedDocuments.find((d: SavedDocument) => d.id === currentDocumentId)?.title || 'Current Document' : 'Current Document'}
            />
          </DialogContent>
        </Dialog>

        {/* Bookmarks Dialog */}
        <Dialog open={showBookmarks} onOpenChange={setShowBookmarks}>
          <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle>Bookmarks</DialogTitle>
            </DialogHeader>
            <BookmarksManager
              bookmarks={bookmarks}
              onAddBookmark={handleAddBookmark}
              onDeleteBookmark={handleDeleteBookmark}
              onJumpToBookmark={handleJumpToBookmark}
              currentChunkIndex={currentIndex}
              totalChunks={safeChunks.length}
            />
          </DialogContent>
        </Dialog>

        {/* Reading Goals Dialog */}
        <Dialog open={showGoals} onOpenChange={setShowGoals}>
          <DialogContent className="max-w-lg bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle>Reading Goals & Streaks</DialogTitle>
            </DialogHeader>
            <ReadingGoals
              goal={readingGoal}
              onUpdateGoal={handleUpdateGoal}
            />
          </DialogContent>
        </Dialog>

        {/* Text-to-Speech Dialog */}
        <Dialog open={showTTS} onOpenChange={setShowTTS}>
          <DialogContent className="max-w-lg bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle>Text-to-Speech</DialogTitle>
            </DialogHeader>
            <TextToSpeech
              text={inputText}
              currentChunkIndex={currentIndex}
              onChunkChange={setCurrentIndex}
              totalChunks={safeChunks.length}
            />
          </DialogContent>
        </Dialog>

        {/* Vocabulary Highlighter Dialog */}
        <Dialog open={showVocabulary} onOpenChange={setShowVocabulary}>
          <DialogContent className="max-w-3xl bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle>Vocabulary Analysis</DialogTitle>
            </DialogHeader>
            <VocabularyHighlighter
              text={inputText}
              onClose={() => setShowVocabulary(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Reading History Calendar Dialog */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle>Reading History</DialogTitle>
            </DialogHeader>
            <ReadingHistoryCalendar sessions={readingHistory} />
          </DialogContent>
        </Dialog>

        {/* Focus Mode */}
        {showFocusMode && safeChunks.length > 0 && (
          <FocusMode
            chunks={safeChunks}
            initialIndex={currentIndex}
            wpm={wpm}
            onClose={() => setShowFocusMode(false)}
            onIndexChange={setCurrentIndex}
          />
        )}
      </main>
    </div>
  );
};

export default App;
