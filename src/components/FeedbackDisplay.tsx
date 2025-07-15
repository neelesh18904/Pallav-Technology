import React from 'react';
import styles from '../styles/FeedbackDisplay.module.css';

interface SentimentResult {
  text: string;
  sentiment: string;
  start: number;
  end: number;
  confidence: number;
}

interface FeedbackDisplayProps {
  feedback: {
    transcript?: string;
    sentiment_analysis_results?: SentimentResult[];
    full_assemblyai_response?: any;
  };
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  if (!feedback) {
    return <div>No feedback available.</div>;
  }

  return (
    <div className={styles.feedback}>
      <h2>Transcript</h2>
      <div className={styles.transcript}>{feedback.transcript || 'No transcript available.'}</div>
      <h2>Sentiment Analysis</h2>
      {feedback.sentiment_analysis_results && feedback.sentiment_analysis_results.length > 0 ? (
        <ul>
          {feedback.sentiment_analysis_results.map((result, idx) => (
            <li key={idx} className={styles[result.sentiment] || ''}>
              <strong>{result.sentiment.toUpperCase()}</strong> (confidence: {(result.confidence * 100).toFixed(1)}%)<br />
              <em>{result.text}</em>
            </li>
          ))}
        </ul>
      ) : (
        <div>No sentiment analysis results available.</div>
      )}
    </div>
  );
};

export default FeedbackDisplay; 