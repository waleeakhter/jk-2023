import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User {
        role: string;
        email: string;
        id: string;
        access_token: string;
    }
    interface Session {
        accessToken: string;
        user: {
            id: string;
            /** The user's postal address. */
            role: string
        },
        token: {
            id: string
        }
    }
    interface JWT {
        user: {
            /** The user's postal address. */
            id: string,
            role: string
        },
        token: {

        }

    }
}