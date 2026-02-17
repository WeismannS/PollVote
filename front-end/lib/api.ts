import { Poll } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function getPolls(): Promise<Poll[]> {
  return fetchApi<Poll[]>("/polls");
}

export async function createPoll(data: {
  title: string;
  description?: string;
  choices: string[];
  anonymous: boolean;
}) {
  return fetchApi("/polls", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function vote(data: { pollId: number; name: string; anonymous: boolean }) {
  return fetchApi("/polls/vote", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deletePoll(id: number) {
  return fetchApi(`/polls/${id}`, {
    method: "DELETE",
  });
}
