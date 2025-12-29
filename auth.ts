import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "./lib/users";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
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
        if (!user.emailVerified) {
          throw new Error("請先完成電子郵件驗證");
        }
        return { id: user.id, name: user.name, email: user.email } as any;
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: { error: "/auth/error" },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};

const { handlers, auth } = NextAuth(authOptions as any);
const handler = handlers.GET;

export { auth, handler };
export default handler;