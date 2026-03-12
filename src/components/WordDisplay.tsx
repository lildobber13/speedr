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
      <div className="absolute top-2 bottom-2 w-px bg-muted-foreground/20 left-1/2" />

      {/* Word container: pivot is placed at center using inline-flex with the before text pushed left */}
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 font-display text-4xl sm:text-5xl md:text-6xl tracking-wider whitespace-nowrap flex items-baseline"
           style={{ transform: 'translate(-50%, -50%)' }}>
        {/* Before text takes its natural width, right-aligned to pivot */}
        <span className="text-reader-text">{before}</span>
        {/* Pivot character */}
        <span className="text-pivot font-bold">{pivot}</span>
        {/* After text */}
        <span className="text-reader-text">{after}</span>
      </div>

      {/* Invisible duplicate to measure offset: pivot center = before.width + pivot.width/2 */}
      {/* We shift the container left by that amount, but since we want pivot at 50%, 
           we use a different approach: offset the transform origin */}
    </div>
  );
};

export default WordDisplay;
