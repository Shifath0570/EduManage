import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_DB_URI || process.env.MONGODB_URI || "";
const dbName = process.env.MONGO_DB_NAME || "EduManage";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  console.warn("MONGO_DB_URI or MONGODB_URI is not defined in environment variables.");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const c = await clientPromise;
  return c.db(dbName);
}

export default clientPromise;
