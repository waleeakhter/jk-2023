import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { nextAuthOptions } from "./authOptions"

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth(nextAuthOptions)