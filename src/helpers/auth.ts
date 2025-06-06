import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { checkRateLimit, resetRateLimit } from "@/lib/redis";
import { REDIS_CACHE_CONSTANTS } from "@/constants/redis-cache";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Get IP address from request
        const ip =
          req?.headers?.["x-forwarded-for"] ||
          req?.headers?.["x-real-ip"] ||
          "unknown-ip";

        // Create a unique identifier using both email and IP
        const identifier = `${credentials.email}:${ip}`;

        // Check rate limit before proceeding
        const rateLimitResult = await checkRateLimit(
          `${REDIS_CACHE_CONSTANTS.LOGIN_RATE_LIMIT_KEY}:${identifier}`
        );

        if (
          !rateLimitResult.success &&
          rateLimitResult.resetInSeconds !== null
        ) {
          const minutes = Math.ceil(rateLimitResult.resetInSeconds / 60);
          throw new Error(
            `Too many failed login attempts. Please try again in ${minutes} minutes.`
          );
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          // User not found, increment failed attempt count
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await user.comparePassword(
          credentials.password
        );

        if (!isPasswordValid) {
          // Password invalid, increment failed attempt count
          throw new Error("Invalid password");
        }

        // Successful login, reset rate limit counter
        await resetRateLimit(
          `${REDIS_CACHE_CONSTANTS.LOGIN_RATE_LIMIT_KEY}:${identifier}`
        );

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
