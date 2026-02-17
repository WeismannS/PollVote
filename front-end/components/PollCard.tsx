"use client";

import { useState } from "react";
import { Poll } from "@/lib/types";
import { VotersModal } from "./VotersModal";

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: number, choice: string, anonymous: boolean) => void;
  onDelete: (id: number) => void;
  currentUserId?: string;
}

export function PollCard({ poll, onVote, onDelete, currentUserId }: PollCardProps) {
  const totalVotes = poll.choices.reduce((sum, c) => sum + c.vote_count, 0);
  const isOwner = currentUserId === poll.user_id;
  
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [voteAnonymous, setVoteAnonymous] = useState(false);
  const [votersModalOpen, setVotersModalOpen] = useState(false);
  const [selectedVoters, setSelectedVoters] = useState<string[]>([]);
  const [selectedChoiceName, setSelectedChoiceName] = useState("");
  const [selectedChoiceTotal, setSelectedChoiceTotal] = useState(0);

  const handleVote = () => {
    if (selectedChoice) {
      onVote(poll.id, selectedChoice, voteAnonymous);
      setSelectedChoice(null);
      setVoteAnonymous(false);
    }
  };

  const openVotersModal = (choiceName: string, voters: string[], total: number) => {
    setSelectedChoiceName(choiceName);
    setSelectedVoters(voters);
    setSelectedChoiceTotal(total);
    setVotersModalOpen(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {poll.title}
            </h3>
            {poll.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {poll.description}
              </p>
            )}
          </div>
          {isOwner && (
            <button
              onClick={() => onDelete(poll.id)}
              className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        <div className="space-y-2">
          {poll.choices.map((choice) => {
            const percentage = totalVotes > 0 
              ? Math.round((choice.vote_count / totalVotes) * 100) 
              : 0;
            const isSelected = selectedChoice === choice.name;

            return (
              <div key={choice.name} className="space-y-1">
                <button
                  onClick={() => setSelectedChoice(choice.name)}
                  className="w-full text-left relative group"
                >
                  <div 
                    className={`absolute inset-0 rounded-md transition-all ${
                      isSelected 
                        ? "bg-blue-200 dark:bg-blue-800/50" 
                        : "bg-blue-100 dark:bg-blue-900/30"
                    }`}
                    style={{ width: `${percentage}%`, opacity: 0.3 }} 
                  />
                  <div className={`relative flex justify-between items-center p-3 border rounded-md transition-colors ${
                    isSelected
                      ? "border-blue-500 dark:border-blue-400"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600"
                  }`}>
                    <span className="text-zinc-800 dark:text-zinc-200">
                      {choice.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {choice.vote_count} votes ({percentage}%)
                      </span>
                    </div>
                  </div>
                </button>
                
                {choice.vote_count > 0 && (
                  <button
                    onClick={() => openVotersModal(choice.name, choice.voters, choice.vote_count)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-2"
                  >
                    View voters ({choice.voters.length} public, {choice.vote_count - choice.voters.length} anonymous)
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {selectedChoice && (
          <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-md">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={voteAnonymous}
                onChange={(e) => setVoteAnonymous(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Vote anonymously
              </span>
            </label>
            <button
              onClick={handleVote}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Vote for "{selectedChoice}"
            </button>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm text-zinc-500 dark:text-zinc-400">
          <span>{poll.voters_count} voters</span>
          <span>{poll.anonymous ? "Anonymous" : `By ${poll.creator || "Unknown"}`}</span>
        </div>
      </div>

      <VotersModal
        isOpen={votersModalOpen}
        onClose={() => setVotersModalOpen(false)}
        choiceName={selectedChoiceName}
        voters={selectedVoters}
        totalVotes={selectedChoiceTotal}
      />
    </>
  );
}
