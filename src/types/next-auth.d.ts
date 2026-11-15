import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      role: "user" | "admin";
      avatar?: string;
      emailVerified: boolean;
      phoneVerified: boolean;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: "user" | "admin";
    avatar?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: "user" | "admin";
    avatar?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  }
}
