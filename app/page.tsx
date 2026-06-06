"use client";

import "@/lib/amplify-config";
import { useState } from "react";
import { FeedbackEntry, FeedbackInput } from "@/types/feedback";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackList from "@/components/FeedbackList";

export default function Home() {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: FeedbackInput): Promise<void> => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const newEntry: FeedbackEntry = {
        id: crypto.randomUUID(),
        name: data.name,
        rating: data.rating as number,
        comment: data.comment,
        createdAt: new Date().toISOString(),
      };

      setFeedbackEntries((prev) => [newEntry, ...prev]);
    } catch {
      setSubmitError("Feedback could not be saved. Please try again.");
      throw new Error("Submit failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Workshop Feedback
      </h1>

      <FeedbackForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      <div className="mt-8">
        <FeedbackList
          entries={feedbackEntries}
          isLoading={false}
          loadError={null}
        />
      </div>
    </div>
  );
}
