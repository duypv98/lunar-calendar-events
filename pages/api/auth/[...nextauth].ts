import AuthService from "@/lib/services/auth";
import User from "@/models/User";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        account: { label: "Account", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("FAILED");
        const { account, password } = credentials;
        if (!account || !password) throw new Error("BAD_REQUEST");
        const { code, user } = await AuthService.login({ account, password });
        if (code !== "SUCCESS") throw new Error(code || "FAILED");
        return { ...user, id: `${user.id}` };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.account = user.account;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.id = token.id;
      // @ts-ignore
      session.user.account = token.account;
      // @ts-ignore
      session.user.name = token.name;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions);