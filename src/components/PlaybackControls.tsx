import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  wpm: number;
  onWpmChange: (wpm: number) => void;
  progress: number;
  totalWords: number;
  currentIndex: number;
  onSeek: (index: number) => void;
  disabled: boolean;
  effectiveWpm?: number;
}

const PlaybackControls = ({
  isPlaying,
  onPlayPause,
  onRestart,
  onSkipBack,
  onSkipForward,
  wpm,
  onWpmChange,
  progress,
  totalWords,
  currentIndex,
  onSeek,
  disabled,
  effectiveWpm,
}: PlaybackControlsProps) => {
  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <Slider
          value={[currentIndex]}
          min={0}
          max={Math.max(totalWords - 1, 0)}
          step={1}
          onValueChange={([v]) => onSeek(v)}
          disabled={disabled}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-body">
          <span>{currentIndex} / {totalWords} words</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Transport controls */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRestart}
          disabled={disabled}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkipBack}
          disabled={disabled}
          className="text-muted-foreground hover:text-foreground"
        >
          <SkipBack className="w-5 h-5" />
        </Button>
        <Button
          onClick={onPlayPause}
          disabled={disabled}
          size="icon"
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkipForward}
          disabled={disabled}
          className="text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* WPM control */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-body w-8">WPM</span>
        <Slider
          value={[wpm]}
          min={100}
          max={1000}
          step={25}
          onValueChange={([v]) => onWpmChange(v)}
          className="flex-1"
        />
        <span className="text-sm font-display text-primary w-12 text-right">{effectiveWpm ?? wpm}</span>
      </div>
    </div>
  );
};

export default PlaybackControls;
