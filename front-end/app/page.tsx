"use client";

import { useState, useEffect } from "react";
import { Poll } from "@/lib/types";
import { getPolls, vote, deletePoll } from "@/lib/api";
import { CreatePollForm } from "@/components/CreatePollForm";
import { PollCard } from "@/components/PollCard";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    loadPolls();
  }, []);

  async function loadPolls() {
    try {
      setLoading(true);
      setError("");
      const data = await getPolls();
      setPolls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load polls");
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(pollId: number, choice: string, anonymous: boolean) {
    try {
      setError("");
      await vote({ pollId, name: choice, anonymous });
      await loadPolls();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to vote");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this poll?")) return;
    
    try {
      setError("");
      await deletePoll(id);
      await loadPolls();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete poll");
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">
            Welcome to Voting App
          </h1>
          <p className="text-xl text-zinc-600 mb-8">
            Create polls and cast your votes. Sign in to get started!
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Sign in
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <CreatePollForm onPollCreated={loadPolls} />

        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Active Polls
          </h2>

          {loading ? (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
              Loading polls...
            </div>
          ) : polls.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
              No polls yet. Create one above!
            </div>
          ) : (
            <div className="space-y-6">
              {polls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onVote={handleVote}
                  onDelete={handleDelete}
                  currentUserId={user.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
