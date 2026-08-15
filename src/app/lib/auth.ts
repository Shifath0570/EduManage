import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient("mongodb+srv://EduManage:YbjauuDpSaOpkITb@cluster0.omojdo6.mongodb.net/?appName=Cluster0");
const db = client.db(process.env.MONGO_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    client
  }),
  user: {
    additionalFields: {
      role: {
        default: "student"
      }
    }
  }
});

