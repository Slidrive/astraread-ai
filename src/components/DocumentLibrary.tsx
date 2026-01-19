import { useState } from 'react';
import { Card, CardContent, CardDescription,
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
interface DocumentLibraryProps {
import { Badge } from './ui/badge';
  onDeleteDocument: (docId: string) => void;
import { toast } from 'sonner';
import { SavedDocument } from '@/lib/types';


  onLoadDocument: (doc: SavedDocument) => void;
  );
}

export function DocumentLibrary({ onLoadDocument, onClose }: DocumentLibraryProps) {
  const [documents, setDocuments] = useKV<SavedDocument[]>('saved-documents', []);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (docId: string) => {
    setDocuments(currentDocs => currentDocs.filter(doc => doc.id !== docId));
    toast.success('Document deleted');
    

          onChange={(e) => setSearchQuery(e.ta
        />
          Clos
      </div>
    

            <p className="text-muted-foregroun
            </p>
              Documents are automatic
          </CardContent>
      ) : (
          <div className="space-y-3">
              <Card
                className="hover:border-primary tra

                  <div className="flex i
                      <CardTitle className="text-
                        <span className="flex items
                          {getWordCount(doc.text
                        {doc.wpm && (
    

                        <span className="f
                          {formatDate(doc.lastReadAt)}
    

          
                        e.stopP
                      }}
              
                    </Button>
                </CardHeader>
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
                            <Zap size={14} />
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
                      <Trash2 size={18} />
                    </Button>
                  </div>

                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {doc.text.substring(0, 150)}...
                  </p>
                </CardContent>

            ))}
          </div>
        </ScrollArea>

    </div>

}
