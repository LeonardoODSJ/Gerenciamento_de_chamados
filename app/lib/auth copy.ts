import NextAuth, { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope: 'openid profile email User.Read',
        },
      },
    }),
  ],
  debug: true,
  session: {
    strategy: 'jwt',
  },
  cookies: {
    state: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('JWT Callback - User:', user, 'Account:', account, 'Token:', token);
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('Session Callback - Session:', session, 'Token:', token);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect Callback - URL:', url, 'Base URL:', baseUrl);
      return url.startsWith('/') ? `${baseUrl}${url}` : url;
    },
  },
};

export const handlers = NextAuth(authOptions);