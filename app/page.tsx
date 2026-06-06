"use client";

import "@/lib/amplify-config";
import { useState, useEffect } from "react";
import { FeedbackEntry, FeedbackInput } from "@/types/feedback";
import { client } from "@/lib/amplify-client";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackList from "@/components/FeedbackList";

export default function Home() {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        const { data } = await client.models.Feedback.list();
        const entries: FeedbackEntry[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          rating: item.rating,
          comment: item.comment,
          createdAt: item.createdAt!,
        }));
        // Sort by createdAt descending (most recent first)
        entries.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeedbackEntries(entries);
      } catch {
        setLoadError("Could not load feedback. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const handleSubmit = async (data: FeedbackInput): Promise<void> => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { data: newFeedback, errors } = await client.models.Feedback.create(
        {
          name: data.name,
          rating: data.rating as number,
          comment: data.comment,
        }
      );
      if (errors || !newFeedback) {
        throw new Error("Create failed");
      }
      const newEntry: FeedbackEntry = {
        id: newFeedback.id,
        name: newFeedback.name,
        rating: newFeedback.rating,
        comment: newFeedback.comment,
        createdAt: newFeedback.createdAt!,
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
          isLoading={isLoading}
          loadError={loadError}
        />
      </div>
    </div>
  );
}
