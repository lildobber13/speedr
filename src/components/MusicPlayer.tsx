import { Music, Volume2, VolumeX, Upload } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [trackName, setTrackName] = useState<string | null>(null);
  const [volume, setVolume] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !audioRef.current) return;
    const url = URL.createObjectURL(file);
    audioRef.current.src = url;
    audioRef.current.volume = volume / 100;
    audioRef.current.loop = true;
    audioRef.current.play();
    setTrackName(file.name);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const toggleMute = () => setIsMuted(!isMuted);

  const togglePlay = () => {
    if (!audioRef.current || !trackName) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="rounded-xl bg-card border border-border p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
        <Music className="w-4 h-4" />
        <span>Background Music</span>
      </div>
      
      <audio ref={audioRef} />
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleFile}
        className="hidden"
      />

      {trackName ? (
        <div className="space-y-3">
          <button
            onClick={togglePlay}
            className="text-sm text-foreground font-body truncate w-full text-left hover:text-primary transition-colors"
          >
            {isPlaying ? '▶' : '⏸'} {trackName}
          </button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute} className="h-7 w-7 text-muted-foreground">
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={100}
              step={5}
              onValueChange={([v]) => { setVolume(v); setIsMuted(false); }}
              className="flex-1"
            />
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Change track
          </button>
        </div>
      ) : (
        <Button
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          className="w-full gap-2 text-sm"
        >
          <Upload className="w-4 h-4" />
          Upload music
        </Button>
      )}
    </div>
  );
};

export default MusicPlayer;
