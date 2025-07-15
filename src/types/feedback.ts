export interface Feedback {
  scores: {
    [key: string]: number;
  };
  overallFeedback: string;
  observation: string;
} 