import { getPivotIndex } from '@/lib/textExtractor';

interface WordDisplayProps {
  word: string;
}

const WordDisplay = ({ word }: WordDisplayProps) => {
  if (!word) {
    return (
      <div className="flex items-center justify-center h-32">
        <span className="font-display text-2xl text-muted-foreground">Ready</span>
      </div>
    );
  }

  const pivotIdx = getPivotIndex(word);
  const before = word.slice(0, pivotIdx);
  const pivot = word[pivotIdx];
  const after = word.slice(pivotIdx + 1);

  return (
    <div className="relative flex items-center justify-center h-32 select-none overflow-hidden">
      {/* Center guide line */}
      <div className="absolute top-2 bottom-2 w-px bg-muted-foreground/20 left-1/2 -translate-x-1/2" />

      <div className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider whitespace-nowrap"
           style={{ position: 'relative' }}>
        {/* This is the layout trick: 
             - A container is centered in the parent (via flex)
             - Inside, we use a grid where the pivot is the anchor column
             - Before text right-aligns into its cell, after text left-aligns */}
        <span style={{ display: 'inline-grid', gridTemplateColumns: '1fr auto 1fr' }} className="items-baseline">
          <span className="text-reader-text text-right">{before}</span>
          <span className="text-pivot font-bold">{pivot}</span>
          <span className="text-reader-text text-left">{after}</span>
        </span>
      </div>
    </div>
  );
};

export default WordDisplay;
