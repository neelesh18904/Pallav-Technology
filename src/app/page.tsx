"use client";
import React, { useState } from "react";
import AudioUploader from "../components/AudioUploader";
import AudioPlayer from "../components/AudioPlayer";
import FeedbackDisplay from "../components/FeedbackDisplay";
import styles from "../styles/page.module.css";

const HomePage: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (file: File) => {
    setAudioUrl(URL.createObjectURL(file));
    setFeedback(null);
    setError("");
    setLoading(true);

    // Start processing automatically
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Timeout after 2 minutes
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
        setError("Processing timed out. Please try again with a shorter audio file.");
        setLoading(false);
      }, 120000); // 2 minutes

      const res = await fetch("/api/analyze-call", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) {
        let errMsg = "Failed to process audio";
        try {
          const errData = await res.json();
          errMsg += errData.error ? `: ${errData.error}` : '';
        } catch {}
        throw new Error(errMsg);
      }
      const data = await res.json();
      setFeedback(data);
    } catch (err: any) {
      if (err.name === 'AbortError') return; // Already handled by timeout
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className={styles.main}>
      <h1>AI Call Feedback System</h1>
      <AudioUploader onFileSelect={handleFileSelect} />
      {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      {loading && <div className={styles.loading}>Processing... (this may take up to 2 minutes)</div>}
      {error && <div className={styles.error}>{error}</div>}
      {feedback && <FeedbackDisplay feedback={feedback} />}
      </main>
  );
};

export default HomePage;
