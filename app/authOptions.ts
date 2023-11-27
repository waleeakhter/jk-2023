import { NextAuthConfig, Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const nextAuthOptions : NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async authorized({ auth, request }: { auth: Session | null, request: NextRequest  }) {
      const isLoggedIn = auth?.user;
      if (!isLoggedIn) {
        return false
      }
      return true
    },
  },
  
};
