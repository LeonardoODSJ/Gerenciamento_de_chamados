import NextAuth, { NextAuthOptions } from 'next-auth';
import AzureADProvider from "next-auth/providers/azure-ad";
import { Provider } from "next-auth/providers/index";

const configureIdentityProvider = () => {
  const providers: Array<Provider> = [];

  const adminEmails = process.env.ADMIN_EMAIL_ADDRESS?.split(",").map((email) =>
    email.toLowerCase().trim()
  );

  if (
    process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID
  ) {
    providers.push(
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID!,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
        tenantId: process.env.AZURE_AD_TENANT_ID!,
        async profile(profile) {

          const newProfile = {
            ...profile,
            id: profile.sub,
            isAdmin:
              adminEmails?.includes(profile.email.toLowerCase()) ||
              adminEmails?.includes(profile.preferred_username.toLowerCase()),

          };
          return newProfile;
        },
      })
    );
  }

  return providers;
};

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [...configureIdentityProvider()],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('JWT Callback - User:', user, 'Account:', account, 'Token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Session:', session, 'Token:', token);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
};

export const handlers = NextAuth(options);