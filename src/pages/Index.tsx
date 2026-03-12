import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import WordDisplay from '@/components/WordDisplay';
import PlaybackControls from '@/components/PlaybackControls';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import MusicPlayer from '@/components/MusicPlayer';
import { extractText, tokenizeText } from '@/lib/textExtractor';
import { useRSVP } from '@/hooks/useRSVP';
import { toast } from 'sonner';

type Theme = 'dark' | 'light' | 'sepia';

const Index = () => {
  const [words, setWords] = useState<string[]>([]);
  const [wpm, setWpm] = useState(300);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>();

  const rsvp = useRSVP(words, wpm);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-sepia', 'theme-light');
    if (theme === 'sepia') root.classList.add('theme-sepia');
    if (theme === 'light') root.classList.add('theme-light');
  }, [theme]);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      const text = await extractText(file);
      const tokens = tokenizeText(text);
      if (tokens.length === 0) {
        toast.error('No text found in the file.');
        return;
      }
      setWords(tokens);
      setFileName(file.name);
      toast.success(`Loaded ${tokens.length} words`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to extract text');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-4 px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
            Speedr
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-6 max-w-2xl mx-auto w-full gap-6">
        {/* File upload (show when no words or always accessible) */}
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
            {/* Reader area */}
            <div className="w-full rounded-2xl bg-reader-bg border border-border p-6 sm:p-8">
              <WordDisplay word={rsvp.currentWord} />
            </div>

            {/* Controls */}
            <div className="w-full">
              <PlaybackControls
                isPlaying={rsvp.isPlaying}
                onPlayPause={rsvp.playPause}
                onRestart={rsvp.restart}
                onSkipBack={rsvp.skipBack}
                onSkipForward={rsvp.skipForward}
                wpm={wpm}
                onWpmChange={setWpm}
                progress={rsvp.progress}
                totalWords={words.length}
                currentIndex={rsvp.currentIndex}
                onSeek={rsvp.seek}
                disabled={words.length === 0}
              />
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
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
};

export default Index;
