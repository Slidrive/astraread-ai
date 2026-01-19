import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { SavedDocument } from '@/lib/types';
import { BookOpen, Clock, Trash } from '@phosphor-icons/react';

interface DocumentLibraryProps {
  documents: SavedDocument[];
  onLoadDocument: (doc: SavedDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onClose: () => void;
}

export function DocumentLibrary({
  documents,
  onLoadDocument,
  onDeleteDocument,
  onClose,
}: DocumentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoad = (doc: SavedDocument) => {
    onLoadDocument(doc);
  };

  const handleDelete = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteDocument(docId);
    toast.success('Document deleted');
  };

  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const formatDate = (timestamp?: number): string => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {filteredDocs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No documents found' : 'No saved documents yet'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Documents are automatically saved when you start reading
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <Card
                key={doc.id}
                className="cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => handleLoad(doc)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{doc.title}</CardTitle>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen size={12} />
                          {getWordCount(doc.text)} words
                        </span>
                        {doc.wpm && (
                          <Badge variant="outline" className="text-xs">
                            {doc.wpm} WPM
                          </Badge>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(doc.lastReadAt)}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleDelete(doc.id, e)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
