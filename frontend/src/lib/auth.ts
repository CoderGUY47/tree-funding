import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/placeholder');
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  user: {
    modelName: 'users',
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
  session: {
    modelName: 'sessions'
  },
  account: {
    modelName: 'accounts'
  },
  verification: {
    modelName: 'verifications'
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      mapProfileToUser: (profile: any) => {
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
