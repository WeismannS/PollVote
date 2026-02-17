"use client";

import { useState } from "react";
import { createPoll } from "@/lib/api";

interface CreatePollFormProps {
  onPollCreated: () => void;
}

export function CreatePollForm({ onPollCreated }: CreatePollFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [choices, setChoices] = useState(["", ""]);
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const addChoice = () => {
    setChoices([...choices, ""]);
  };

  const removeChoice = (index: number) => {
    if (choices.length > 2) {
      setChoices(choices.filter((_, i) => i !== index));
    }
  };

  const updateChoice = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validChoices = choices.filter((c) => c.trim() !== "");
    if (validChoices.length < 2) {
      setError("Please provide at least 2 choices");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPoll({
        title: title.trim(),
        description: description.trim() || undefined,
        choices: validChoices,
        anonymous,
      });
      setTitle("");
      setDescription("");
      setChoices(["", ""]);
      setAnonymous(false);
      onPollCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create poll");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Create New Poll
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Question
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to ask?"
            maxLength={50}
            required
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about your poll (optional)"
            maxLength={500}
            rows={3}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Choices
          </label>
          <div className="space-y-2">
            {choices.map((choice, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={choice}
                  onChange={(e) => updateChoice(index, e.target.value)}
                  placeholder={`Choice ${index + 1}`}
                  maxLength={50}
                  required
                  className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100"
                />
                {choices.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeChoice(index)}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {choices.length < 8 && <button
            type="button"
            onClick={addChoice}
            className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            + Add another choice
          </button>}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="anonymous"
            className="text-sm text-zinc-700 dark:text-zinc-300"
          >
            Anonymous poll (creator hidden)
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create Poll"}
        </button>
      </div>
    </form>
  );
}
