import { useRef, useEffect, useState } from 'react';
import { getPivotIndex } from '@/lib/textExtractor';

interface WordDisplayProps {
  word: string;
}

const WordDisplay = ({ word }: WordDisplayProps) => {
  const wordRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState(0);

  const pivotIdx = word ? getPivotIndex(word) : 0;
  const before = word ? word.slice(0, pivotIdx) : '';
  const pivot = word ? word[pivotIdx] : '';
  const after = word ? word.slice(pivotIdx + 1) : '';

  useEffect(() => {
    if (wordRef.current && pivotRef.current) {
      const containerCenter = wordRef.current.offsetWidth / 2;
      const pivotLeft = pivotRef.current.offsetLeft;
      const pivotCenter = pivotLeft + pivotRef.current.offsetWidth / 2;
      setOffset(containerCenter - pivotCenter);
    }
  }, [word]);

  if (!word) {
    return (
      <div className="flex items-center justify-center h-32">
        <span className="font-display text-2xl text-muted-foreground">Ready</span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center h-32 select-none overflow-hidden">
      {/* Center guide line */}
      <div className="absolute top-2 bottom-2 w-px bg-muted-foreground/20 left-1/2" />

      <div
        ref={wordRef}
        className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider whitespace-nowrap"
        style={{ transform: `translateX(${offset}px)` }}
      >
        <span className="text-reader-text">{before}</span>
        <span ref={pivotRef} className="text-pivot font-bold">{pivot}</span>
        <span className="text-reader-text">{after}</span>
      </div>
    </div>
  );
};

export default WordDisplay;
