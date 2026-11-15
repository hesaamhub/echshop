"use client";

import { useSession } from "next-auth/react";
import { Session } from "next-auth";

export function useAuth() {
  const { data: session, status, update } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isAdmin: session?.user?.role === "admin",
    session,
    status,
    update,
  };
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
};

export type AuthSession = Session & {
  user: AuthUser;
};
