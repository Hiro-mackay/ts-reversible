import { hc } from "hono/client";
import { AppTypes } from "..";

// this is a trick to calculate the type when compiling
const client = hc<AppTypes>("");
type Client = typeof client;

const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppTypes>(...args);

export const appClient = hcWithType("", {
  headers: { "Content-Type": "application/json" },
});
