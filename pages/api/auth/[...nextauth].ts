import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateEmailForMrDuLow } from "../../../lib/validators";

const ADMIN_EMAILS = ["qse6209@gmail.com", "mrdulow12@gmail.com"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Yahoo or Corporate Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@yahoo.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || typeof credentials.email !== "string") return null;

        const validation = validateEmailForMrDuLow(credentials.email);
        if (!validation.isValid || !validation.email) {
          throw new Error(validation.error || "Invalid email credentials.");
        }

        const validEmail = validation.email;
        const isAdmin = ADMIN_EMAILS.includes(validEmail);

        return {
          id: "usr-" + Date.now(),
          name: validEmail.split("@")[0],
          email: validEmail,
          image: "https://hoggzvisionqse.netlify.app/default-avatar.png",
          isAdmin,
        } as any;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email || typeof user.email !== "string") return false;
      const validation = validateEmailForMrDuLow(user.email);
      return Boolean(validation.isValid);
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const userEmail = String(user.email).trim().toLowerCase();
        token.isAdmin = ADMIN_EMAILS.includes(userEmail);
      } else if (token?.email) {
        const tokenEmail = String(token.email).trim().toLowerCase();
        token.isAdmin = ADMIN_EMAILS.includes(tokenEmail);
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        if (token?.sub) {
          (session.user as any).id = token.sub;
        }
        const sessionEmail = session.user.email ? String(session.user.email).trim().toLowerCase() : "";
        (session.user as any).isAdmin = ADMIN_EMAILS.includes(sessionEmail);
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
