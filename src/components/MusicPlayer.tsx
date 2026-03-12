import { Music, Volume2, VolumeX, SkipForward, Pause, Play } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const TRACKS = [
  { name: 'Midnight Stroll', file: '/music/Midnight_Stroll.wav' },
  { name: 'No Problem', file: '/music/No_Problem.wav' },
  { name: 'Sunny Sidewalk', file: '/music/Sunny_Sidewalk.wav' },
  { name: 'Tape Warp', file: '/music/Tape_Warp.wav' },
  { name: 'Any Day Now', file: '/music/Any_Day_Now.wav' },
  { name: 'Cure My Blues', file: '/music/Cure_My_Blues.wav' },
  { name: 'Delerious Smile', file: '/music/Delerious_Smile.wav' },
  { name: 'Everybody Dreams', file: '/music/Everybody_Dreams.wav' },
  { name: 'Golden Hour', file: '/music/Golden_Hour.wav' },
  { name: 'Hello Tomorrow', file: '/music/Hello_Tomorrow.wav' },
];

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [volume, setVolume] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = useCallback((index: number) => {
    if (!audioRef.current) return;
    if (currentTrack === index && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    audioRef.current.src = TRACKS[index].file;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
    audioRef.current.loop = true;
    audioRef.current.play();
    setCurrentTrack(index);
    setIsPlaying(true);
  }, [currentTrack, isPlaying, volume, isMuted]);

  const nextTrack = useCallback(() => {
    const next = currentTrack === null ? 0 : (currentTrack + 1) % TRACKS.length;
    if (!audioRef.current) return;
    audioRef.current.src = TRACKS[next].file;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
    audioRef.current.loop = true;
    audioRef.current.play();
    setCurrentTrack(next);
    setIsPlaying(true);
  }, [currentTrack, volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  return (
    <div className="rounded-xl bg-card border border-border p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
        <Music className="w-4 h-4" />
        <span>Lofi Chill Vibes</span>
      </div>

      <audio ref={audioRef} />

      {/* Track grid */}
      <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
        {TRACKS.map((track, i) => (
          <button
            key={track.file}
            onClick={() => playTrack(i)}
            className={`text-left text-xs font-body px-2.5 py-2 rounded-lg transition-all truncate
              ${currentTrack === i
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'
              }`}
          >
            {currentTrack === i && isPlaying ? '♪ ' : ''}{track.name}
          </button>
        ))}
      </div>

      {/* Playback & volume */}
      {currentTrack !== null && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost" size="icon"
              onClick={() => {
                if (!audioRef.current) return;
                if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
                else { audioRef.current.play(); setIsPlaying(true); }
              }}
              className="h-7 w-7 text-muted-foreground"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={nextTrack} className="h-7 w-7 text-muted-foreground">
              <SkipForward className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="h-7 w-7 text-muted-foreground">
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0} max={100} step={5}
              onValueChange={([v]) => { setVolume(v); setIsMuted(false); }}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
