import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Badge } from './ui/badge';
import { ReadingGoal } from '@/lib/types';
import { Target, Flame, Trophy, TrendUp } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface ReadingGoalsProps {
  goal: ReadingGoal;
  onUpdateGoal: (newTarget: number) => void;
}

export function ReadingGoals({ goal, onUpdateGoal }: ReadingGoalsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newTarget, setNewTarget] = useState(goal.dailyWordTarget.toString());

  const progressPercentage = Math.min(100, (goal.wordsReadToday / goal.dailyWordTarget) * 100);
  const isGoalReached = goal.wordsReadToday >= goal.dailyWordTarget;

  const handleSaveTarget = () => {
    const targetNum = parseInt(newTarget, 10);
    if (isNaN(targetNum) || targetNum < 100) {
      toast.error('Please enter a valid word target (minimum 100)');
      return;
    }
    onUpdateGoal(targetNum);
    setShowEditDialog(false);
    toast.success('Daily goal updated');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Card className="bg-gradient-to-br from-blue-950/40 to-purple-950/40 border-blue-800/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target size={20} className="text-blue-400" />
          Daily Reading Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Today's Progress</span>
            <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(true)}>
              Edit Goal
            </Button>
          </div>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">
                {formatNumber(goal.wordsReadToday)} / {formatNumber(goal.dailyWordTarget)} words
              </span>
              <span className={isGoalReached ? 'text-green-400 font-semibold' : 'text-muted-foreground'}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          {isGoalReached && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 w-full justify-center py-2">
              <Trophy size={16} className="mr-2" />
              Goal Reached! 🎉
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-slate-900/60 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame size={20} className="text-orange-400" />
                <span className="text-2xl font-bold text-foreground">{goal.currentStreak}</span>
              </div>
              <p className="text-xs text-muted-foreground">Current Streak</p>
              <p className="text-xs text-muted-foreground mt-1">days</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy size={20} className="text-yellow-400" />
                <span className="text-2xl font-bold text-foreground">{goal.longestStreak}</span>
              </div>
              <p className="text-xs text-muted-foreground">Longest Streak</p>
              <p className="text-xs text-muted-foreground mt-1">days</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900/60 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendUp size={20} className="text-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Total Words Read</p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-foreground">{formatNumber(goal.totalWordsRead)}</span>
            </div>
          </CardContent>
        </Card>
      </CardContent>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Edit Daily Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Daily Word Target</label>
              <Input
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="bg-slate-950/60 border-slate-700"
                min="100"
                step="100"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: 1000-5000 words per day
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTarget}>Save Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
