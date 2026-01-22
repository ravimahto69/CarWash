import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnection from '@/app/lib/db';
import User from '@/app/models/User';
import bcryptjs from 'bcryptjs';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnection();
          
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          }).select('+password');

          if (!user) {
            throw new Error('Invalid email or password');
          }

          const isMatch = await bcryptjs.compare(credentials.password, user.password);
          
          if (!isMatch) {
            throw new Error('Invalid email or password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          throw new Error(error.message || 'Authentication failed');
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'facebook') {
        try {
          await dbConnection();
          
          // Find or create user with unique provider ID
          let existingUser = await User.findOne({ 
            $or: [
              { authProviderId: account.providerAccountId },
              { email: user.email.toLowerCase() }
            ]
          });
          
          if (!existingUser) {
            // Create completely new user
            existingUser = await User.create({
              name: user.name || 'User',
              email: user.email.toLowerCase(),
              password: await bcryptjs.hash(Math.random().toString(36).slice(2), 10),
              role: 'user',
              authProvider: account.provider,
              authProviderId: account.providerAccountId,
            });
          } else if (!existingUser.authProviderId || existingUser.authProviderId !== account.providerAccountId) {
            // Update existing user with new provider info
            existingUser.authProvider = account.provider;
            existingUser.authProviderId = account.providerAccountId;
            await existingUser.save();
          }
          
          user.id = existingUser._id.toString();
          user.role = existingUser.role;
          user.email = existingUser.email;
          user.name = existingUser.name;
          
          return true;
        } catch (error) {
          console.error('OAuth Sign in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
