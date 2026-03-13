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
    if (wordRef.current && pivotRef.current) {
      const wordWidth = wordRef.current.offsetWidth;
      const pivotLeft = pivotRef.current.offsetLeft;
      const pivotCenter = pivotLeft + pivotRef.current.offsetWidth / 2;
      const wordCenter = wordWidth / 2;
      setOffset(wordCenter - pivotCenter);
    }
  }, [word]);

  if (!word) {
    return (
      <div className="flex items-center justify-center h-32">
        <span className="font-body text-2xl text-muted-foreground">Ready</span>
      </div>
    );
  }

  const fontSize = 'text-3xl sm:text-4xl md:text-5xl';

  return (
    <div ref={containerRef} className="relative flex items-center justify-center h-32 select-none overflow-hidden">
      {/* Center guide line */}
      <div className="absolute top-2 bottom-2 w-px bg-muted-foreground/20 left-1/2 -translate-x-1/2" />

      <div className="relative flex items-center justify-center w-full">
        <div
          ref={wordRef}
          className={`font-body font-medium ${fontSize} tracking-normal whitespace-nowrap absolute`}
          style={{ left: '50%', transform: `translateX(-50%)`, marginLeft: `${offset}px` }}
        >
          <span className="text-reader-text">{before}</span>
          <span ref={pivotRef} className="text-pivot font-bold">{pivot}</span>
          <span className="text-reader-text">{after}</span>
        </div>
      </div>
    </div>
  );
};

export default WordDisplay;
