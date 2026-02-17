"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Users, EyeOff } from "lucide-react";

interface VotersModalProps {
  isOpen: boolean;
  onClose: () => void;
  choiceName: string;
  voters: string[];
  totalVotes: number;
}

export function VotersModal({ isOpen, onClose, choiceName, voters, totalVotes }: VotersModalProps) {
  const anonymousCount = totalVotes - voters.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Voters for "{choiceName}"";
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge variant="secondary">{totalVotes} total</Badge>
            <Badge variant="outline">{voters.length} public</Badge>
            <Badge variant="outline">{anonymousCount} anonymous</Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {voters.length > 0 ? (
            voters.map((voter, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{voter}</span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <EyeOff className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">
                No public voters for this choice
              </p>
            </div>
          )}
        </div>

        {anonymousCount > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
              <Users className="h-4 w-4" />
              <span>
                +{anonymousCount} anonymous voter{anonymousCount === 1 ? "" : "s"}
              </span>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
