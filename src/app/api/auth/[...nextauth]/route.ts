import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/lib/db/models/User";

interface Credentials {
  email?: string;
  phone?: string;
  password?: string;
}

interface UserSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface CustomToken {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: "user" | "admin";
  avatar?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

interface CustomSession {
  user: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: "user" | "admin";
    avatar?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
  };
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "ایمیل", type: "email" },
        phone: { label: "شماره موبایل", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        await dbConnect();

        // Check if email or phone is provided
        if (!credentials?.email && !credentials?.phone) {
          throw new Error("لطفاً ایمیل یا شماره موبایل وارد کنید");
        }

        if (!credentials?.password) {
          throw new Error("لطفاً رمز عبور وارد کنید");
        }

        // Find user by email or phone
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

        // Check password
        const isValid = await user.comparePassword(credentials.password);
        
        if (!isValid) {
          throw new Error("رمز عبور اشتباه است");
        }

        // Return user object without password
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        } as UserSession;
      },
    }),
  ],
  
  // Custom pages
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  // Callbacks
  callbacks: {
    async jwt({ token, user }: { token: CustomToken; user: UserSession }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
        token.emailVerified = user.emailVerified;
        token.phoneVerified = user.phoneVerified;
      }
      return token;
    },
    async session({ session, token }: { session: CustomSession; token: CustomToken }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.emailVerified = token.emailVerified;
        session.user.phoneVerified = token.phoneVerified;
      }
      return session;
    },
  },
  
  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Secret for JWT
  secret: process.env.NEXTAUTH_SECRET,
  
  // Security
  trustHost: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
