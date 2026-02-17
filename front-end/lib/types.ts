export interface Choice {
  poll_id: number;
  name: string;
  vote_count: number;
  voters: string[];
}

export interface Poll {
  id: number;
  title: string;
  description: string | null;
  voters_count: number;
  anonymous: boolean;
  created_at: string;
  creator: string | null;
  user_id: string;
  choices: Choice[];
}

export interface CreatePollData {
  title: string;
  description?: string;
  choices: string[];
  anonymous: boolean;
}

export interface VoteData {
  pollId: number;
  name: string;
  anonymous: boolean;
}
