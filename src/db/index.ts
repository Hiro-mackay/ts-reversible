import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const url = `postgres://${import.meta.env.VITE_DB_USER}:${
  import.meta.env.VITE_DB_PASSWORD
}@${import.meta.env.VITE_DB_HOST}:${import.meta.env.VITE_DB_PORT}/${
  import.meta.env.VITE_DB_NAME
}`;

console.log("=======================================");
console.log(url);
console.log("=======================================");

const client = new pg.Client({
  connectionString: url,
});

await client.connect();

const db = drizzle(client);

export { client, db };
