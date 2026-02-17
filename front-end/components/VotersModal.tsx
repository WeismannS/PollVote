"use client";

interface VotersModalProps {
  isOpen: boolean;
  onClose: () => void;
  choiceName: string;
  voters: string[];
  totalVotes: number;
}

export function VotersModal({ isOpen, onClose, choiceName, voters, totalVotes }: VotersModalProps) {
  if (!isOpen) return null;

  const anonymousCount = totalVotes - voters.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Voters for "{choiceName}"
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Total votes: {totalVotes} ({voters.length} public, {anonymousCount} anonymous)
          </p>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {voters.length > 0 ? (
            <ul className="space-y-2">
              {voters.map((voter, index) => (
                <li
                  key={index}
                  className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-md text-zinc-800 dark:text-zinc-200"
                >
                  {voter}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-zinc-500 dark:text-zinc-400 py-4">
              No public voters for this choice
            </p>
          )}
        </div>

        {anonymousCount > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            +{anonymousCount} anonymous voter{anonymousCount === 1 ? "" : "s"}
          </div>
        )}
      </div>
    </div>
  );
}
