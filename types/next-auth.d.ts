import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
    };
  }

  interface JWT {
    id: string;
    role: string;
  }
}
