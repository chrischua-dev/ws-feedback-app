"use client";

import { FeedbackEntry } from "@/types/feedback";

interface FeedbackListProps {
  entries: FeedbackEntry[];
  isLoading: boolean;
  loadError: string | null;
}

export default function FeedbackList({
  entries,
  isLoading,
  loadError,
}: FeedbackListProps) {
  if (isLoading) {
    return (
      <div className="py-8 text-center text-gray-500">
        Loading feedback...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No feedback has been submitted yet.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="rounded border border-gray-200 px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{entry.name}</span>
            <span className="text-sm text-gray-600">
              Rating: {entry.rating}/5
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-700">{entry.comment}</p>
        </li>
      ))}
    </ul>
  );
}
