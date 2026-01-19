import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Badge } from './ui/badge';
import { Bookmark } from '@/lib/types';
import { BookmarkSimple, NotePencil, Trash, Plus } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface BookmarksManagerProps {
  bookmarks: Bookmark[];
  onAddBookmark: (chunkIndex: number, note?: string) => void;
  onDeleteBookmark: (bookmarkId: string) => void;
  onJumpToBookmark: (chunkIndex: number) => void;
  currentChunkIndex: number;
  totalChunks: number;
}

export function BookmarksManager({
  bookmarks,
  onAddBookmark,
  onDeleteBookmark,
  onJumpToBookmark,
  currentChunkIndex,
  totalChunks,
}: BookmarksManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');

  const handleAddBookmark = () => {
    setShowAddDialog(true);
  };

  const handleSaveBookmark = () => {
    onAddBookmark(currentChunkIndex, bookmarkNote.trim() || undefined);
    setBookmarkNote('');
    setShowAddDialog(false);
    toast.success('Bookmark added');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedBookmarks = [...bookmarks].sort((a, b) => a.chunkIndex - b.chunkIndex);

  return (
    <Card className="bg-slate-900/70 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookmarkSimple size={20} />
            Bookmarks ({bookmarks.length})
          </CardTitle>
          <Button onClick={handleAddBookmark} size="sm" disabled={totalChunks === 0}>
            <Plus size={16} className="mr-2" />
            Add Bookmark
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No bookmarks yet. Add a bookmark to mark important sections.
          </p>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {sortedBookmarks.map((bookmark) => (
                <Card
                  key={bookmark.id}
                  className="bg-slate-950/60 border-slate-700 cursor-pointer hover:border-blue-500/50 transition-colors"
                  onClick={() => onJumpToBookmark(bookmark.chunkIndex)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            Chunk {bookmark.chunkIndex + 1}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(bookmark.createdAt)}
                          </span>
                        </div>
                        {bookmark.note && (
                          <p className="text-sm text-slate-300 mt-2 flex items-start gap-2">
                            <NotePencil size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{bookmark.note}</span>
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBookmark(bookmark.id);
                          toast.success('Bookmark deleted');
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Bookmarking chunk {currentChunkIndex + 1} of {totalChunks}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Note (optional)</label>
              <Textarea
                placeholder="Add a note about this section..."
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                className="bg-slate-950/60 border-slate-700"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBookmark}>Save Bookmark</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
