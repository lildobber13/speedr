import { Music, Volume2, VolumeX } from 'lucide-react';
import { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

type Vibe = 'lofi' | 'ambient' | 'piano' | 'guitar' | 'none';

const VIBES: { id: Vibe; label: string; emoji: string }[] = [
  { id: 'none', label: 'No Music', emoji: '🔇' },
  { id: 'lofi', label: 'Lofi Chill', emoji: '☁️' },
  { id: 'ambient', label: 'Dark Ambient', emoji: '🌑' },
  { id: 'piano', label: 'Piano', emoji: '🎹' },
  { id: 'guitar', label: 'Guitar Warmth', emoji: '🎸' },
];

const TRACKS: Record<Exclude<Vibe, 'none'>, { name: string; file: string }[]> = {
  lofi: [
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
  ],
  ambient: [
    { name: 'Deep Reflection', file: '/music/Deep_Reflection.wav' },
    { name: 'Echo Recall', file: '/music/Echo_Recall.wav' },
    { name: 'Floating Points', file: '/music/Floating_Points.wav' },
    { name: 'Following Light', file: '/music/Following_Light.wav' },
    { name: 'Liminal Lullaby', file: '/music/Liminal_Lullaby.wav' },
    { name: 'Lost Dreaming', file: '/music/Lost_Dreaming.wav' },
    { name: 'Night Explorer', file: '/music/Night_Explorer.wav' },
    { name: 'Analgesic Embrace', file: '/music/Analgesic_Embrace.wav' },
    { name: 'Atmos Wave', file: '/music/Atmos_Wave.wav' },
    { name: 'Cognitive Pathway', file: '/music/Cognitive_Pathway.wav' },
  ],
  piano: [
    { name: 'Calm Waters', file: '/music/Calm_Waters.wav' },
    { name: 'Dreams Of Green', file: '/music/Dreams_Of_Green.wav' },
    { name: 'Flower Boxes', file: '/music/Flower_Boxes.wav' },
    { name: 'Garden Path', file: '/music/Garden_Path.wav' },
    { name: 'Home Again', file: '/music/Home_Again.wav' },
    { name: 'Kaleidoscopic View', file: '/music/Kaleidoscopic_View.wav' },
    { name: 'Lakeside Respite', file: '/music/Lakeside_Respite.wav' },
    { name: 'Romantic Canal', file: '/music/Romantic_Canal.wav' },
    { name: 'Welcome Inn', file: '/music/Welcome_Inn.wav' },
    { name: 'Beautiful Blossoms', file: '/music/Beautiful_Blossoms.wav' },
  ],
  guitar: [
    { name: 'Endless Highway', file: '/music/Endless_Highway.wav' },
    { name: 'First Rays Of Light', file: '/music/First_Rays_Of_Light.wav' },
    { name: 'Genuine Hospitality', file: '/music/Genuine_Hospitality.wav' },
    { name: 'Hazy Afternoon', file: '/music/Hazy_Afternoon.wav' },
    { name: 'Open Spaces', file: '/music/Open_Spaces.wav' },
    { name: 'Stay A While', file: '/music/Stay_A_While.wav' },
    { name: 'Thoughtful Reflection', file: '/music/Thoughtful_Reflection.wav' },
    { name: 'Warm Memory', file: '/music/Warm_Memory.wav' },
    { name: 'Zoned Out', file: '/music/Zoned_Out.wav' },
    { name: 'Clear Skies', file: '/music/Clear_Skies.wav' },
  ],
};

export interface MusicPlayerHandle {
  play: () => void;
  pause: () => void;
}

const MusicPlayer = forwardRef<MusicPlayerHandle>((_props, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [vibe, setVibe] = useState<Vibe>('none');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState('');

  const startPlayback = useCallback(() => {
    if (vibe === 'none' || !audioRef.current) return;
    const tracks = TRACKS[vibe];
    audioRef.current.src = tracks[currentTrackIndex].file;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
    audioRef.current.play();
    setCurrentTrackName(tracks[currentTrackIndex].name);
    setIsPlaying(true);
  }, [vibe, currentTrackIndex, volume, isMuted]);

  const stopPlayback = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  // Expose play/pause to parent
  useImperativeHandle(ref, () => ({
    play: () => {
      if (vibe === 'none') return;
      startPlayback();
    },
    pause: () => {
      stopPlayback();
    },
  }), [vibe, startPlayback, stopPlayback]);

  // When track ends, play next
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      if (vibe === 'none') return;
      const tracks = TRACKS[vibe];
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [vibe, currentTrackIndex]);

  // Auto-play when track index changes (if already playing)
  useEffect(() => {
    if (isPlaying && vibe !== 'none' && audioRef.current) {
      const tracks = TRACKS[vibe];
      audioRef.current.src = tracks[currentTrackIndex].file;
      audioRef.current.volume = isMuted ? 0 : volume / 100;
      audioRef.current.play();
      setCurrentTrackName(tracks[currentTrackIndex].name);
    }
  }, [currentTrackIndex]); // intentionally minimal deps - only react to index changes

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handleVibeChange = useCallback((newVibe: Vibe) => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
    setVibe(newVibe);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setCurrentTrackName('');
  }, [isPlaying]);

  return (
    <div className="rounded-xl bg-card border border-border p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
        <Music className="w-4 h-4" />
        <span>Background Music</span>
      </div>

      <audio ref={audioRef} />

      {/* Vibe selector */}
      <div className="grid grid-cols-5 gap-1.5">
        {VIBES.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => handleVibeChange(id)}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-body transition-all overflow-hidden
              ${vibe === id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'
              }`}
          >
            <span className="text-base">{emoji}</span>
            <span
              className={`w-full text-center whitespace-nowrap ${vibe === id ? 'animate-marquee' : 'truncate'}`}
              style={{ fontSize: '0.65rem' }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Now playing & volume */}
      {vibe !== 'none' && (
        <div className="space-y-2">
          {currentTrackName && (
            <div className="text-xs text-muted-foreground font-body truncate">
              {isPlaying ? '♪ ' : ''}{currentTrackName}
            </div>
          )}
          <div className="flex items-center gap-2">
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
});

MusicPlayer.displayName = 'MusicPlayer';

export default MusicPlayer;
