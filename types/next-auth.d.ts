import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User {
        img: string | null | undefined;
        email: string | null | undefined;
        id: string | null | undefined;
        role: string | null | undefined;
        access_token: string;
    }
    interface Session {
        accessToken: string;
        user: {
            img: string | null | undefined;
            email: string | null | undefined;
            id: string | null | undefined;
            role: string | null | undefined;
        },
        token: {
            img: string | null | undefined;
            email: string | null | undefined;
            id: string | null | undefined;
            role: string | null | undefined;
        }
    }
    interface JWT {
        user: {
      
            img: string | null | undefined;
            email: string | null | undefined;
            id: string | null | undefined;
            role: string | null | undefined;
        },
        token: {
            img: string | null | undefined;
            email: string | null | undefined;
            id: string | null | undefined;
            role: string | null | undefined;
        }

    }
   
}