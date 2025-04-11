import NextAuth, { User as NextAuthUser } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { UserRole } from "@prisma/client";
import { prisma } from "@/utils/prisma";

declare module "next-auth" {
  interface CustomUser extends NextAuthUser {
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: CustomUser;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [Google],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Fetch full user data from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.createdAt = dbUser.createdAt;
          token.updatedAt = dbUser.updatedAt;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.createdAt = token.createdAt as Date;
        session.user.updatedAt = token.updatedAt as Date;
      }
      return session;
    },
  },
});
