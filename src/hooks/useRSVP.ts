import { useState, useEffect, useCallback, useRef } from 'react';

export function useRSVP(words: string[], wpm: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWord = words[currentIndex] ?? '';
  const progress = words.length > 0 ? (currentIndex / (words.length - 1)) * 100 : 0;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    const delay = 60000 / wpm;
    intervalRef.current = setTimeout(() => {
      setCurrentIndex(prev => {
        if (prev >= words.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, delay);
  }, [wpm, words.length]);

  useEffect(() => {
    clearTimer();
    if (isPlaying && words.length > 0) {
      scheduleNext();
    }
    return clearTimer;
  }, [isPlaying, currentIndex, scheduleNext, clearTimer, words.length]);

  const playPause = useCallback(() => {
    if (currentIndex >= words.length - 1 && !isPlaying) {
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [currentIndex, isPlaying, words.length]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  const skipBack = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 10));
  }, []);

  const skipForward = useCallback(() => {
    setCurrentIndex(prev => Math.min(words.length - 1, prev + 10));
  }, [words.length]);

  const seek = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Reset on new words
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [words]);

  return {
    currentWord,
    currentIndex,
    isPlaying,
    progress,
    playPause,
    restart,
    skipBack,
    skipForward,
    seek,
  };
}
