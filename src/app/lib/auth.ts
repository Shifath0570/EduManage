
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI || "");
const db = client.db(process.env.MONGO_DB_NAME);

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    cookiePrefix: "my_app_v2"
  },
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

