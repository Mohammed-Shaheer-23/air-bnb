import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { ObjectId } from "bson";

import prisma from "@/app/libs/prismadb";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account && (account.provider === "google" || account.provider === "github")) {
        // Check if user already exists in the database
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        // If user doesn't exist, create a new user
        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              email: user.email as string,
              name: user.name || "",
              image: user.image || "",
              emailVerified: null,
              hashedPassword: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              favoriteIds: [],
            },
          });
        }

        // Ensure `userId` is a valid ObjectId
        const userId = new ObjectId(existingUser.id).toString();

        // Upsert the account information
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          update: {},
          create: {
            userId: userId, // Use valid MongoDB ObjectId
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token || "",
            refresh_token: account.refresh_token || "",
            expires_at: account.expires_at || null,
            token_type: account.token_type || "",
            session_state: account.session_state || "",
            type: account.type || "oauth",
          },
        });
      }

      return true;
    },
  },
  pages: {
    signIn: "/", // Customize the sign-in page URL if needed
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt", // Using JWT for session strategy
  },
  secret: process.env.NEXTAUTH_SECRET, // Add your secret key
};

export default NextAuth(authOptions);
