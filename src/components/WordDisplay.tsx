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
      <div className="absolute top-2 bottom-2 w-px bg-muted-foreground/20" style={{ left: '50%' }} />

      {/* 
        Use absolute positioning so the pivot character is always at the exact center.
        The before-text is right-aligned ending at the pivot, after-text left-aligned starting after pivot.
      */}
      <div className="relative font-display text-4xl sm:text-5xl md:text-6xl tracking-wider whitespace-nowrap">
        {/* Invisible pivot to establish center reference */}
        <span className="invisible">{pivot}</span>
        
        {/* Actual content positioned so pivot sits at center */}
        <span className="absolute left-1/2 top-1/2 -translate-y-1/2 flex items-baseline">
          {/* Before text, right-aligned to end at pivot */}
          <span className="text-right text-reader-text" style={{ direction: 'rtl', unicodeBidi: 'bidi-override' }}>
            <span style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}>{before}</span>
          </span>
          {/* Pivot letter anchored at center via negative translate */}
          <span className="text-pivot font-bold" style={{ transform: 'translateX(-50%)' }}>{pivot}</span>
          {/* After text */}
          <span className="text-reader-text">{after}</span>
        </span>
      </div>
    </div>
  );
};

export default WordDisplay;
