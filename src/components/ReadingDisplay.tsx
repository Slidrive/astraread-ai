import { motion, AnimatePresence } from 'framer-motion';
import { TextChunk } from '@/lib/text-parser';

interface ReadingDisplayProps {
  chunk: TextChunk | null;
  isPlaying: boolean;
}

export function ReadingDisplay({ chunk, isPlaying }: ReadingDisplayProps) {
  if (!chunk) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground text-lg">
          Paste or upload text to begin
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[300px] px-8 py-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={chunk.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.08 }}
          className="flex items-center gap-3 flex-wrap justify-center"
        >
          {chunk.words.map((word, index) => {
            const isFocus = index === chunk.focusIndex;
            return (
              <span
                key={`${chunk.id}-${index}`}
                className={`
                  ${isFocus ? 'text-accent font-bold text-5xl md:text-6xl' : 'text-foreground/50 text-3xl md:text-4xl'}
                  transition-all duration-75
                  ${isFocus && isPlaying ? 'animate-pulse' : ''}
                `}
                style={{
                  letterSpacing: isFocus ? '-0.02em' : 'normal',
                  lineHeight: 1.1,
                }}
              >
                {word}
              </span>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
