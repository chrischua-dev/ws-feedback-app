import { FeedbackInput } from "@/types/feedback";

export interface ValidationErrors {
  name?: string;
  rating?: string;
  comment?: string;
}

export function validateFeedback(input: FeedbackInput): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation: required, not whitespace-only, max 100 chars
  if (!input.name || input.name.trim().length === 0) {
    errors.name = "Name is required";
  } else if (input.name.length > 100) {
    errors.name = "Name must be 100 characters or less";
  }

  // Rating validation: required, integer 1-5
  if (input.rating === null || input.rating === undefined) {
    errors.rating = "Rating is required";
  } else if (
    !Number.isInteger(input.rating) ||
    input.rating < 1 ||
    input.rating > 5
  ) {
    errors.rating = "Rating must be an integer between 1 and 5";
  }

  // Comment validation: required, not whitespace-only, max 500 chars
  if (!input.comment || input.comment.trim().length === 0) {
    errors.comment = "Comment is required";
  } else if (input.comment.length > 500) {
    errors.comment = "Comment must be 500 characters or less";
  }

  return errors;
}
