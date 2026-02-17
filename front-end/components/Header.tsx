"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export function Header() {
  const { user, isLoading, signOut } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Voting App
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <span className="text-gray-500">Loading...</span>
          ) : user ? (
            <>
              <span className="text-gray-700">{user.name || user.email}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-500 border border-red-300 rounded-md hover:bg-red-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
