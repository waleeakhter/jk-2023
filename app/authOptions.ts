import { NextRequest } from "next/server";
import getServerSession from "next-auth"
export const nextAuthOptions = {
  providers:[],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request  } : { auth: {user : Object}, request :any }) {

      const isLoggedIn = auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/", request.nextUrl));
      }
      return true;
    },
  },
};
