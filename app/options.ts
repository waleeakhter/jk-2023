

import Admin from "@/models/Admin";
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
let apiURL = ""
if (process.env.NODE_ENV === "production") {
    apiURL = process.env.Live_API_URL ?? " "
}

if (process.env.NODE_ENV == "development") {
    process.env.API_URL
}
export const nextAuthOptions: NextAuthOptions = {
    providers: [

        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req: any) {

                const res = await Admin.findOne({ email: credentials.usename, password: credentials.password })
                const user = await res.json()

                // If no error and we have user data, return it
                if (user?.name) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    pages: { signIn: "/auth/login" },
    session: {
        strategy: "jwt"
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET
    }
}


