import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
  connectionString: import.meta.env.DATABASE_URL,
});

await client.connect();

const db = drizzle(client);

export { client, db };
