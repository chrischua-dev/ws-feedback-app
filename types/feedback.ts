export interface FeedbackInput {
  name: string;
  rating: number | null;
  comment: string;
}

export interface FeedbackEntry {
  id: string;
  name: string;
  rating: number; // integer 1-5
  comment: string;
  createdAt: string; // ISO 8601 timestamp
}
