import React, { useRef } from 'react';
import styles from '../styles/AudioPlayer.module.css';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div className={styles.player}>
      <audio ref={audioRef} controls src={audioUrl} />
    </div>
  );
};

export default AudioPlayer; 