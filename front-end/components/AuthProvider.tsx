"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, ReactNode } from "react";
import { authClient, useSession } from "@/lib/auth";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: typeof authClient.signIn;
  signUp: typeof authClient.signUp;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? null,
        isLoading: isPending,
        signIn: authClient.signIn,
        signUp: authClient.signUp,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
