import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import clientPromise from './mongodb';

export const auth = betterAuth({
  database: mongodbAdapter(clientPromise, {
    collections: {
      user: 'users',
      session: 'sessions',
      account: 'accounts',
      verification: 'verifications'
    }
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'Supporter'
      },
      credits: {
        type: 'number',
        defaultValue: 0
      },
      photoUrl: {
        type: 'string',
        defaultValue: ''
      }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      mapProfile: (profile) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          emailVerified: profile.email_verified,
          image: profile.picture,
          // Custom fields mapping
          role: 'Supporter',
          credits: 50, // Default Google social sign-up credits
          photoUrl: profile.picture || ''
        };
      }
    }
  }
});
