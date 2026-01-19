import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { BookOpen, Trash, Clock, Lightning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { SavedDocument } from '@/lib/types';

interface DocumentLibraryProps {
  documents: SavedDocument[];
  onLoadDocument: (doc: SavedDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onClose: () => void;
}

export function DocumentLibrary({ documents, onLoadDocument, onDeleteDocument, onClose }: DocumentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((doc: SavedDocument) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (docId: string) => {
    onDeleteDocument(docId);
    toast.success('Document deleted');
  };

  const handleLoad = (doc: SavedDocument) => {
    onLoadDocument(doc);
    onClose();
    toast.success(`Loaded: ${doc.title}`);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
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
              Documents are automatically saved when you load text
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <Card
                key={doc.id}
                className="hover:border-primary transition-colors cursor-pointer"
                onClick={() => handleLoad(doc)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{doc.title}</CardTitle>
                      <CardDescription className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <BookOpen size={14} />
                          {getWordCount(doc.text)} words
                        </span>
                        {doc.wpm && (
                          <span className="flex items-center gap-1">
                            <Lightning size={14} />
                            {doc.wpm} WPM
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDate(doc.lastReadAt)}
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash size={18} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {doc.text.substring(0, 150)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
