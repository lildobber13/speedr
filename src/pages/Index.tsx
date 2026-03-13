import { useState, useEffect, useRef, useCallback } from 'react';
import { Zap, Maximize2, Minimize2 } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import WordDisplay from '@/components/WordDisplay';
import PlaybackControls from '@/components/PlaybackControls';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import MusicPlayer, { MusicPlayerHandle } from '@/components/MusicPlayer';
import { extractText, tokenizeText } from '@/lib/textExtractor';
import { useRSVP, ScalingConfig } from '@/hooks/useRSVP';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type Theme = 'dark' | 'light' | 'sepia';

const Index = () => {
  const [words, setWords] = useState<string[]>([]);
  const [wpm, setWpm] = useState(300);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const musicRef = useRef<MusicPlayerHandle>(null);

  // Scaling config
  const [scalingEnabled, setScalingEnabled] = useState(false);
  const [scalingTarget, setScalingTarget] = useState(600);

  const scalingConfig: ScalingConfig = {
    enabled: scalingEnabled,
    startWpm: wpm,
    targetWpm: scalingTarget,
    stepSize: 25,
    wordsPerStep: 50,
  };

  const rsvp = useRSVP(words, wpm, scalingConfig);

  // Coordinate music with reading play/pause
  const prevPlaying = useRef(false);
  useEffect(() => {
    if (rsvp.isPlaying && !prevPlaying.current) {
      musicRef.current?.play();
    } else if (!rsvp.isPlaying && prevPlaying.current) {
      musicRef.current?.pause();
    }
    prevPlaying.current = rsvp.isPlaying;
  }, [rsvp.isPlaying]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-sepia', 'theme-light');
    if (theme === 'sepia') root.classList.add('theme-sepia');
    if (theme === 'light') root.classList.add('theme-light');
  }, [theme]);

  const handleFileSelect = useCallback(async (file: File) => {
    console.log('[Speedr] handleFileSelect called', file.name);
    setIsLoading(true);
    try {
      console.log('[Speedr] Starting extraction...');
      const text = await extractText(file);
      console.log('[Speedr] Extraction done, length:', text.length);
      const tokens = tokenizeText(text);
      if (tokens.length === 0) {
        toast.error('No text found in the file.');
        return;
      }
      setWords(tokens);
      setFileName(file.name);
      toast.success(`Loaded ${tokens.length} words`);
    } catch (err: any) {
      console.error('[Speedr] Extraction error:', err);
      toast.error(err.message || 'Failed to extract text');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-4 px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
            S<span className="text-pivot">p</span>eedr
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-6 max-w-2xl mx-auto w-full gap-6">
        {words.length === 0 ? (
          <div className="w-full space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground font-body">
                Upload a document and read it at lightning speed
              </p>
            </div>
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} fileName={fileName} />
          </div>
        ) : (
          <>
            {/* Fullscreen overlay */}
            {isFullscreen && (
              <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                  <Minimize2 className="w-5 h-5" />
                </Button>
                <div className="w-full max-w-3xl">
                  <WordDisplay word={rsvp.currentWord} />
                </div>
                <div className="w-full max-w-2xl mt-8">
                  <PlaybackControls
                    isPlaying={rsvp.isPlaying}
                    onPlayPause={rsvp.playPause}
                    onRestart={rsvp.restart}
                    wpm={wpm}
                    onWpmChange={setWpm}
                    progress={rsvp.progress}
                    totalWords={words.length}
                    currentIndex={rsvp.currentIndex}
                    onSeek={rsvp.seek}
                    disabled={words.length === 0}
                    effectiveWpm={rsvp.effectiveWpm}
                  />
                </div>
              </div>
            )}

            {/* Reader area */}
            <div className="w-full rounded-2xl bg-reader-bg border border-border p-6 sm:p-8 relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(true)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground h-7 w-7"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <WordDisplay word={rsvp.currentWord} />
            </div>

            {/* Controls */}
            <div className="w-full">
              <PlaybackControls
                isPlaying={rsvp.isPlaying}
                onPlayPause={rsvp.playPause}
                onRestart={rsvp.restart}
                wpm={wpm}
                onWpmChange={setWpm}
                progress={rsvp.progress}
                totalWords={words.length}
                currentIndex={rsvp.currentIndex}
                onSeek={rsvp.seek}
                disabled={words.length === 0}
                effectiveWpm={rsvp.effectiveWpm}
              />
            </div>

            {/* Scaling option */}
            <div className="w-full rounded-xl bg-card border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="scaling-toggle" className="text-sm font-body text-foreground cursor-pointer">
                  🚀 Speed Scaling
                </Label>
                <Switch
                  id="scaling-toggle"
                  checked={scalingEnabled}
                  onCheckedChange={setScalingEnabled}
                />
              </div>
              {scalingEnabled && (
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground font-body w-20">Target WPM</span>
                    <Slider
                      value={[scalingTarget]}
                      min={Math.max(wpm + 25, 200)}
                      max={1000}
                      step={25}
                      onValueChange={([v]) => setScalingTarget(v)}
                      className="flex-1"
                    />
                    <span className="text-sm font-display text-primary w-12 text-right">{scalingTarget}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body">
                    Starts at {wpm} WPM, increases by 25 every 50 words up to {scalingTarget} WPM
                  </p>
                  {rsvp.isPlaying && (
                    <p className="text-xs text-primary font-body font-medium">
                      Current speed: {rsvp.effectiveWpm} WPM
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* File info & change */}
            <div className="w-full">
              <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} fileName={fileName} />
            </div>
          </>
        )}

        {/* Settings panel */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ThemeSwitcher theme={theme} onThemeChange={setTheme} />
          <MusicPlayer ref={musicRef} />
        </div>
      </main>
    </div>
  );
};

export default Index;
