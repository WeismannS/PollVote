"use client";

import { useState } from "react";
import { Poll } from "@/lib/types";
import { VotersModal } from "./VotersModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Trash2, Users, Eye, CheckCircle2 } from "lucide-react";

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
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <CardTitle className="text-xl">{poll.title}</CardTitle>
              {poll.description && (
                <CardDescription className="text-sm">{poll.description}</CardDescription>
              )}
            </div>
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(poll.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {poll.choices.map((choice) => {
            const percentage = totalVotes > 0
              ? Math.round((choice.vote_count / totalVotes) * 100)
              : 0;
            const isSelected = selectedChoice === choice.name;
            const maxVotes = Math.max(...poll.choices.map(c => c.vote_count));
            const isWinning = choice.vote_count === maxVotes && choice.vote_count > 0;

            return (
              <div key={choice.name} className="space-y-2">
                <button
                  onClick={() => setSelectedChoice(choice.name)}
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                      <span className={cn(
                        "font-medium",
                        isWinning && "text-primary"
                      )}>
                        {choice.name}
                      </span>
                      {isWinning && (
                        <Badge variant="default" className="text-xs">Leading</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono tabular-nums">
                        {percentage}%
                      </Badge>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {choice.vote_count}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <Progress
                      value={percentage}
                      className={cn(
                        "h-full transition-all duration-500",
                        isWinning ? "bg-primary" : "bg-primary/60"
                      )}
                    />
                  </div>
                </button>

                {choice.vote_count > 0 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => openVotersModal(choice.name, choice.voters, choice.vote_count)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View voters ({choice.voters.length} public, {choice.vote_count - choice.voters.length} anonymous)
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>

        {selectedChoice && (
          <CardContent className="pt-0">
            <div className="p-4 bg-muted/50 rounded-lg space-y-3 border">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`anonymous-${poll.id}`}
                  checked={voteAnonymous}
                  onCheckedChange={(checked) => setVoteAnonymous(checked as boolean)}
                />
                <Label htmlFor={`anonymous-${poll.id}`} className="text-sm font-normal cursor-pointer">
                  Vote anonymously
                </Label>
              </div>
              <Button onClick={handleVote} className="w-full">
                Vote for {selectedChoice}
              </Button>
            </div>
          </CardContent>
        )}

        <Separator />
        <CardFooter className="py-3">
          <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{poll.voters_count} voter{poll.voters_count !== 1 ? "s" : ""}</span>
            </div>
            <Badge variant={poll.anonymous ? "secondary" : "outline"}>
              {poll.anonymous ? "Anonymous" : poll.creator || "Unknown"}
            </Badge>
          </div>
        </CardFooter>
      </Card>

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
