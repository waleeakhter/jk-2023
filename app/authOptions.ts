import getServerSession, { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

import clientPromise from "./utils/clientPromise";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import Admin from "@/models/Admin";
import dbConnect from "./utils/dbConnect";
export const nextAuthOptions: NextAuthConfig = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Aaron" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // Find your user in the database using MongoDBAdapter
                if (credentials.password === undefined && credentials.password === undefined) {
                    await dbConnect()
                    const user = await Admin.findOne({ email: credentials.username, password: credentials.password })
                    if (user) {
                        return user;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        // Set it as jwt instead of database
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (user) {
                token.accessToken = user.access_token as string;
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token and user id from a provider.
            if (session.user) {
                session.accessToken = token.accessToken as string;
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }

            return session;
        },
    },
}


export const getServerSessionGlobal = () => getServerSession(nextAuthOptions) 