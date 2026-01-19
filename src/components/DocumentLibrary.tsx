import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
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
  const handleDelete = (docId: string, e: R
    onDeleteDo
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
                      <CardTitle className="text-lg truncate">{doc.title}</CardTi
                        <span className="flex i
               
                        {doc.wpm && (
                            {doc.wpm} WPM
                        )}
                          <Clock size={12} />
                        </span>
                    </div>
                      variant="ghost"
                      onClick={(e) => handleDelete(doc.i
                    >
                    </Button>
                </CardHeader>
            ))}
        </ScrollArea>
    </div>
}












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
