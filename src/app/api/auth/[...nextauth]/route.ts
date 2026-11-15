import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/lib/db/models/User";
import { Session } from "next-auth";

interface CredentialsType {
  email?: string;
  phone?: string;
  password?: string;
}

interface UserType {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface TokenType {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: "user" | "admin";
  avatar?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "ایمیل", type: "email" },
        phone: { label: "شماره موبایل", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials: CredentialsType | undefined) {
        await dbConnect();

        if (!credentials?.email && !credentials?.phone) {
          throw new Error("لطفاً ایمیل یا شماره موبایل وارد کنید");
        }

        if (!credentials?.password) {
          throw new Error("لطفاً رمز عبور وارد کنید");
        }

        const user = await User.findOne({
          $or: [
            { email: credentials.email },
            { phone: credentials.phone },
          ],
        }).select("+password");

        if (!user) {
          throw new Error("کاربری با این اطلاعات یافت نشد");
        }

        if (!user.isActive) {
          throw new Error("حساب کاربری شما غیرفعال است");
        }

        const isValid = await user.comparePassword(credentials.password);
        
        if (!isValid) {
          throw new Error("رمز عبور اشتباه است");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        } as UserType;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: TokenType; user: UserType }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
        token.emailVerified = user.emailVerified;
        token.phoneVerified = user.phoneVerified;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: TokenType }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
        session.user.avatar = token.avatar as string;
        session.user.emailVerified = token.emailVerified as boolean;
        session.user.phoneVerified = token.phoneVerified as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});

export { handler as GET, handler as POST };
