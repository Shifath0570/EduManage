import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI || "");
const db = client.db(process.env.MONGO_DB_NAME);

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  advanced: {
    cookiePrefix: "my_app_v2"
  },
  plugins: [
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_JWT_ISSUER || "edumanage",
        audience: process.env.BETTER_AUTH_JWT_AUDIENCE || "edumanage-client",
        expirationTime: "15m",
        definePayload: (session) => {
          return {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: (session.user as any).role || "student",
          };
        }
      }
    })
  ],
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    client
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "student",
        required: false,
      },
    },
  },
});
<<<<<<< HEAD
=======



>>>>>>> b88572d96ea733a1804a78636619141f053b7d0e
