import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import  dbConnect  from "./utils/dbConnect";
import  AdminModal  from "@/models/Admin";
import  bcrypt from 'bcrypt';

const login = async (credentials: Partial<Record<string, unknown>>) => {
  try {
    await dbConnect();
    const user = await AdminModal.findOne({ email: credentials.username });
    if (!user && user.role !== "admin") throw new Error("Wrong credentials!dsasd");
 
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(credentials.password as string, salt);
    // console.log(hashedPassword , "userss")
    const isPasswordCorrect = await bcrypt.compare(
      credentials.password as string,
      user.password
    );

    if (!isPasswordCorrect) throw new Error("Wrongsa");

    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to login!");
  }
};

export const { signIn, signOut, auth  ,  handlers: { GET, POST },  } = NextAuth({
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  // ADD ADDITIONAL INFORMATION TO SESSION
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.img = user.img;
        token.role = user.role
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.role = token.role as string
        session.user.img = token.img as string;
      }
      return session;
    },
 
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
});
