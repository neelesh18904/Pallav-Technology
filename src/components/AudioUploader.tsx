"use client";
import React, { useRef } from 'react';
import styles from '../styles/AudioUploader.module.css';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={styles.uploader}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.wav"
        style={{ display: 'none' }}
        onChange={handleChange}
        aria-label="Upload audio file"
      />
      <p>Drag & Drop or Click to Upload .mp3/.wav</p>
    </div>
  );
};

export default AudioUploader; 