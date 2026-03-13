import { useRef, useEffect, useState } from 'react';
import { getPivotIndex } from '@/lib/textExtractor';

interface WordDisplayProps {
  word: string;
}

const WordDisplay = ({ word }: WordDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState(0);

  const pivotIdx = word ? getPivotIndex(word) : 0;
  const before = word ? word.slice(0, pivotIdx) : '';
  const pivot = word ? word[pivotIdx] : '';
  const after = word ? word.slice(pivotIdx + 1) : '';

  useEffect(() => {
    if (containerRef.current && pivotRef.current && wordRef.current) {
      const containerCenter = containerRef.current.offsetWidth / 2;
      const pivotRect = pivotRef.current.getBoundingClientRect();
      const wordRect = wordRef.current.getBoundingClientRect();
      const pivotCenterInWord = (pivotRect.left - wordRect.left) + pivotRect.width / 2;
      setOffset(containerCenter - pivotCenterInWord);
    }
  }, [word]);

  if (!word) {
    return (
      <div className="flex items-center justify-center h-32">
        <span className="font-body text-2xl text-muted-foreground">Ready</span>
      </div>
    );
  }

  // Scale font size based on word length to prevent overflow
  const getFontSize = (w: string) => {
    const len = w.length;
    if (len > 25) return 'text-base sm:text-lg md:text-xl';
    if (len > 20) return 'text-lg sm:text-xl md:text-2xl';
    if (len > 14) return 'text-xl sm:text-2xl md:text-3xl';
    if (len > 10) return 'text-2xl sm:text-3xl md:text-4xl';
    return 'text-3xl sm:text-4xl md:text-5xl';
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-center h-32 select-none overflow-hidden">
      {/* Center guide line */}
      <div className="absolute top-2 bottom-2 w-px bg-muted-foreground/20 left-1/2" />

      <div
        ref={wordRef}
        className={`font-body font-medium ${getFontSize(word)} tracking-normal whitespace-nowrap`}
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
