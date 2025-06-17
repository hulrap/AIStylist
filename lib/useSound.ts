import { useEffect, useRef } from 'react';

export const useSound = (soundPath: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(soundPath);
      audioRef.current.volume = 0.2; // Set volume to 20%
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundPath]);

  const play = () => {
    if (audioRef.current) {
      // Create a new audio instance for each play to allow overlapping sounds
      const sound = new Audio(audioRef.current.src);
      sound.volume = 0.2;
      sound.play().catch(() => {
        // Ignore errors (e.g., if user hasn't interacted with page yet)
      });
    }
  };

  return { play };
}; 