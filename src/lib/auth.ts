import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { roleHasPermission, type Permission, type Role } from "@/lib/permissions";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as never),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase().trim() },
        });
        if (!user || !user.isActive) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});

// ── Helpers ──────────────────────────────────────────────────────────────────

export async function requireUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireRole(roles: Role[]) {
  const user = await requireUser();
  if (!user) return null;
  if (!roles.includes(user.role as Role)) return null;
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  if (!user) return null;
  if (!roleHasPermission(user.role as Role, permission)) return null;
  return user;
}

export function can(userRole: Role | undefined, permission: Permission): boolean {
  if (!userRole) return false;
  return roleHasPermission(userRole, permission);
}

export type SessionUser = {
  id: string;
  email: string | null;
  role: Role;
  name?: string | null;
  image?: string | null;
};
