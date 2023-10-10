import { getServerSession, type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const nextAuthOptions: NextAuthOptions = {
    providers: [

        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "enter your email" },
                password: { label: "Password", type: "password", placeholder: "enter your password" }
            },
            async authorize(credentials: any) {
                const body = {
                    id: "1234",
                    "email": "admin@gmail.com",
                    "password": "admin1234"
                }
                // const res = await fetch(process.env.API_URL + "api/admin", {
                //     method: 'post',
                //     body: JSON.stringify({ email: credentials.usename, password: credentials.password }),
                //     cache: 'no-cache',
                // })
                // const user = await res.json()
                // If no error and we have user data, return it
                console.log(credentials.username === body.email && credentials.password === body.password, credentials)
                if (credentials.username === body.email && credentials.password === body.password) {
                    return body
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
}


export const getServerSessionGlobal = () => getServerSession(nextAuthOptions) 