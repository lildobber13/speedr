import { useState, useEffect, useCallback, useRef } from 'react';

export interface ScalingConfig {
  enabled: boolean;
  startWpm: number;
  targetWpm: number;
  stepSize: number;       // WPM increase per step
  wordsPerStep: number;   // how many words before increasing
}

export function useRSVP(words: string[], wpm: number, scaling?: ScalingConfig) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [effectiveWpm, setEffectiveWpm] = useState(wpm);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordsAtCurrentStepRef = useRef(0);

  const currentWord = words[currentIndex] ?? '';
  const progress = words.length > 0 ? (currentIndex / (words.length - 1)) * 100 : 0;

  // Reset effective WPM when scaling config or base wpm changes
  useEffect(() => {
    if (scaling?.enabled) {
      setEffectiveWpm(scaling.startWpm);
      wordsAtCurrentStepRef.current = 0;
    } else {
      setEffectiveWpm(wpm);
    }
  }, [wpm, scaling?.enabled, scaling?.startWpm, scaling?.targetWpm]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    const delay = 60000 / effectiveWpm;
    intervalRef.current = setTimeout(() => {
      setCurrentIndex(prev => {
        if (prev >= words.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        // Handle scaling ramp-up
        if (scaling?.enabled) {
          wordsAtCurrentStepRef.current += 1;
          if (wordsAtCurrentStepRef.current >= scaling.wordsPerStep) {
            wordsAtCurrentStepRef.current = 0;
            setEffectiveWpm(current => Math.min(current + scaling.stepSize, scaling.targetWpm));
          }
        }
        return prev + 1;
      });
    }, delay);
  }, [effectiveWpm, words.length, scaling]);

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
      if (scaling?.enabled) {
        setEffectiveWpm(scaling.startWpm);
        wordsAtCurrentStepRef.current = 0;
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [currentIndex, isPlaying, words.length, scaling]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
    if (scaling?.enabled) {
      setEffectiveWpm(scaling.startWpm);
      wordsAtCurrentStepRef.current = 0;
    }
  }, [scaling]);

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
    if (scaling?.enabled) {
      setEffectiveWpm(scaling.startWpm);
      wordsAtCurrentStepRef.current = 0;
    }
  }, [words]);

  return {
    currentWord,
    currentIndex,
    isPlaying,
    progress,
    effectiveWpm,
    playPause,
    restart,
    skipBack,
    skipForward,
    seek,
  };
}
