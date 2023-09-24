

import Admin from "@/models/Admin";
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const nextAuthOptions: NextAuthOptions = {
    providers: [

        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req: any) {
                console.log("first", credentials)

                const res = await Admin.findOne({ email: credentials.usename, password: credentials.password })
                console.log("user", res)
                // If no error and we have user data, return it
                if (res?.name) {
                    return res
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/signout',
    },
    session: {
        strategy: "jwt"
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET
    }
}


