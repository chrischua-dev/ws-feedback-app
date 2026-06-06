"use client";

import { useState } from "react";
import { FeedbackInput } from "@/types/feedback";
import { validateFeedback, ValidationErrors } from "@/lib/validation";
import RatingSelector from "@/components/RatingSelector";

interface FeedbackFormProps {
  onSubmit: (data: FeedbackInput) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
}

export default function FeedbackForm({
  onSubmit,
  isSubmitting,
  submitError,
}: FeedbackFormProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const input: FeedbackInput = { name, rating, comment };
    const validationErrors = validateFeedback(input);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await onSubmit(input);
      // Clear form on successful submit
      setName("");
      setRating(null);
      setComment("");
    } catch {
      // Submit error is handled by the parent via submitError prop
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {submitError && (
        <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="feedback-name" className="text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="feedback-name"
          type="text"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="feedback-rating" className="text-sm font-medium text-gray-700">
          Rating
        </label>
        <RatingSelector
          id="feedback-rating"
          value={rating}
          onChange={setRating}
          error={errors.rating}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="feedback-comment" className="text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          id="feedback-comment"
          maxLength={500}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.comment ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.comment && (
          <p className="text-sm text-red-600">{errors.comment}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit
      </button>
    </form>
  );
}
