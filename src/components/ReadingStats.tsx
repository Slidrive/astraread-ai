import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { ChartBar, Lightning, Clock, BookOpen, Trophy } from '@phosphor-icons/react';

interface ReadingSession {
  timestamp: number;
  wordsRead: number;
  avgWpm: number;
  duration: number;
}

interface ReadingStatsProps {
  totalWordsRead: number;
  currentWpm: number;
  sessionsToday: number;
  avgCompletionRate: number;
  recentSessions: ReadingSession[];
}

export function ReadingStats({
  totalWordsRead,
  currentWpm,
  sessionsToday,
  avgCompletionRate,
  recentSessions,
}: ReadingStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const totalMinutesRead = recentSessions.reduce((sum, s) => sum + s.duration, 0) / 60;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BookOpen size={16} />
              Total Words
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(totalWordsRead)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Lightning size={16} />
              Current Speed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentWpm}</div>
            <p className="text-xs text-muted-foreground">WPM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock size={16} />
              Reading Time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(totalMinutesRead)}</div>
            <p className="text-xs text-muted-foreground">minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Trophy size={16} />
              Sessions Today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{sessionsToday}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
          <CardDescription>Average progress through loaded documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={avgCompletionRate} className="h-3" />
          <div className="text-right text-sm text-muted-foreground">
            {Math.round(avgCompletionRate)}%
          </div>
        </CardContent>
      </Card>

      {recentSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your latest reading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {recentSessions.map((session, index) => (
                  <div
                    key={`${session.timestamp}-${index}`}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {formatNumber(session.wordsRead)} words
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(session.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Lightning size={14} className="text-primary" />
                        <span>{session.avgWpm} WPM</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-muted-foreground" />
                        <span>{formatDuration(session.duration)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
