import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    providers: [
        Google,
        GitHub,
    Credentials({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter UserName" },
        password: { label: "Password", type: "password", placeholder: "Enter Password" },
      },
    //   async authorize({ request }) {
    //     const response = await fetch(request);
    //     if (!response.ok) return null;
        //     return (await response.json()) ?? null;
        async authorize(username, password) {
          const user = { id: "1", name: "Bichesq", password: "nextgmail.com" };
          if (username === user.name && password === user.password) {
            return user;
          } else {
            return null;
          }
      },
    }),
  ],
});
