"use client";

import { useState, useEffect } from "react";
import { Poll } from "@/lib/types";
import { getPolls, vote, deletePoll } from "@/lib/api";
import { CreatePollForm } from "@/components/CreatePollForm";
import { PollCard } from "@/components/PollCard";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Vote, RefreshCw, AlertCircle, Inbox, Loader2 } from "lucide-react";

function PollCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

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
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-4">
              <Vote className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-4 max-w-md">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Welcome to Voting App
              </h1>
              <p className="text-xl text-muted-foreground">
                Create polls and cast your votes. Sign in to get testing my assessment!
              </p>
            </div>
            <Button asChild size="lg" className="mt-4">
              <Link href="/login">
                Sign in
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CreatePollForm onPollCreated={loadPolls} />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">Active Polls</h2>
              {!loading && (
                <span className="text-sm text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  {polls.length}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadPolls}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-6">
              {[1, 2].map((i) => (
                <PollCardSkeleton key={i} />
              ))}
            </div>
          ) : polls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
              <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg mb-1">No polls yet</p>
              <p className="text-muted-foreground text-sm">
                Create your first poll using the form above!
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
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
