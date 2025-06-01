import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter UserName",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Password",
        },
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        const user = { id: "1", name: "Bichesq", email: "bichesq@gmail.com" };
        if (username === user.name && password === "nextgmail.com") {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("🔐 Session callback - session:", session);
      console.log("🔐 Session callback - token:", token);
      if (token?.sub) {
        session.user.id = token.sub;

        // Fetch user role from database
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true },
          });
          if (user) {
            session.user.role = user.role;
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("🔐 JWT callback - token:", token);
      console.log("🔐 JWT callback - user:", user);
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
