import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "./lib/users";
import bcrypt from "bcryptjs";

/**
 * NextAuth configuration with a Credentials provider that checks
 * email + password against stored passwordHash.
 */

export const authOptions = {
  providers: [
    // Credentials provider for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials || !credentials.email || !credentials.password) return null;
        const user = findUserByEmail(credentials.email);
        if (!user || !user.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        // Return minimal user object for session
        return { id: user.id, name: user.name, email: user.email } as any;
      },
    }),

    // Optional GitHub provider (if configured)
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions as any);
