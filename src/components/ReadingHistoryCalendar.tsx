import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CalendarBlank } from '@phosphor-icons/react';
import { ReadingSession } from '@/lib/types';

interface ReadingHistoryCalendarProps {
  sessions: ReadingSession[];
  onClose?: () => void;
}

export function ReadingHistoryCalendar({ sessions }: ReadingHistoryCalendarProps) {
  const calendarData = useMemo(() => {
    const today = new Date();
    const days: Array<{ date: Date; session?: ReadingSession }> = [];
    
    for (let i = 41; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dateStr = date.toDateString();
      const session = sessions.find(s => s.date === dateStr);
      
      days.push({ date, session });
    }
    
    return days;
  }, [sessions]);

  const getIntensityClass = (wordsRead?: number) => {
    if (!wordsRead) return 'bg-slate-800 border-slate-700';
    if (wordsRead < 500) return 'bg-blue-900/40 border-blue-700';
    if (wordsRead < 1000) return 'bg-blue-700/50 border-blue-600';
    if (wordsRead < 2000) return 'bg-blue-600/60 border-blue-500';
    return 'bg-blue-500/70 border-blue-400';
  };

  const totalWords = sessions.reduce((sum, s) => sum + s.wordsRead, 0);
  const totalDocs = sessions.reduce((sum, s) => sum + s.documentsRead, 0);
  const avgWpm = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.avgWpm, 0) / sessions.length)
    : 0;

  return (
    <Card className="bg-slate-900/70 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarBlank size={24} className="text-blue-400" />
            Reading History
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{totalWords.toLocaleString()}</p>
            <p className="text-xs text-slate-400">Total Words</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{totalDocs}</p>
            <p className="text-xs text-slate-400">Documents Read</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{avgWpm}</p>
            <p className="text-xs text-slate-400">Avg WPM</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-400 mb-3">Last 6 weeks</p>
          <div className="grid grid-cols-7 gap-2">
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded border ${getIntensityClass(
                  day.session?.wordsRead
                )} hover:border-blue-400 transition-colors relative group`}
                title={day.session
                  ? `${day.date.toLocaleDateString()}: ${day.session.wordsRead} words`
                  : day.date.toLocaleDateString()
                }
              >
                {day.session && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {day.session.wordsRead}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded border bg-slate-800 border-slate-700"></div>
              <div className="w-3 h-3 rounded border bg-blue-900/40 border-blue-700"></div>
              <div className="w-3 h-3 rounded border bg-blue-700/50 border-blue-600"></div>
              <div className="w-3 h-3 rounded border bg-blue-600/60 border-blue-500"></div>
              <div className="w-3 h-3 rounded border bg-blue-500/70 border-blue-400"></div>
            </div>
            <span>More</span>
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <p className="text-sm font-semibold text-slate-300">Recent Sessions</p>
            {sessions.slice(-5).reverse().map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700"
              >
                <div>
                  <p className="text-sm text-slate-300">{session.date}</p>
                  <p className="text-xs text-slate-400">
                    {session.documentsRead} doc{session.documentsRead !== 1 ? 's' : ''} • {session.avgWpm} WPM
                  </p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {session.wordsRead} words
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
