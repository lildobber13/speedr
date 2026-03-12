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

  // We need to center the pivot letter in the container
  // Use a fixed-width approach where the pivot is always at center
  return (
    <div className="relative flex items-center justify-center h-32 select-none">
      {/* Center guide line */}
      <div className="absolute top-2 bottom-2 w-px bg-muted-foreground/20" />
      
      <div className="flex items-baseline font-display text-4xl sm:text-5xl md:text-6xl tracking-wider">
        <span className="text-right min-w-[2.5ch] sm:min-w-[3ch]" style={{ direction: 'rtl', unicodeBidi: 'bidi-override' }}>
          <span className="text-reader-text" style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}>
            {before}
          </span>
        </span>
        <span className="text-pivot font-bold mx-0.5">{pivot}</span>
        <span className="text-left min-w-[2.5ch] sm:min-w-[3ch] text-reader-text">
          {after}
        </span>
      </div>
    </div>
  );
};

export default WordDisplay;
