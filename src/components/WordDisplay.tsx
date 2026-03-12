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
    <div className="relative flex items-center justify-center h-32 select-none overflow-hidden font-display text-4xl sm:text-5xl md:text-6xl tracking-wider">
      {/* Center guide line */}
      <div className="absolute top-2 bottom-2 w-px bg-muted-foreground/20 left-1/2" />

      {/* Before: right-aligned, ending at center */}
      <span
        className="absolute text-reader-text text-right whitespace-nowrap"
        style={{ right: '50%', top: '50%', transform: 'translateY(-50%)' }}
      >
        {before}
      </span>

      {/* Pivot: centered at 50% */}
      <span
        className="absolute text-pivot font-bold whitespace-nowrap"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        {pivot}
      </span>

      {/* After: left-aligned, starting at center */}
      <span
        className="absolute text-reader-text text-left whitespace-nowrap"
        style={{ left: '50%', top: '50%', transform: 'translateY(-50%)' }}
      >
        {after}
      </span>
    </div>
  );
};

export default WordDisplay;
