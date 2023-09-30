import { nextAuthOptions } from "@/app/authOptions"
import NextAuth from "next-auth"

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE }


