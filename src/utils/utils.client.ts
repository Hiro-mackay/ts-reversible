import { hc } from "hono/client";
import { AppTypes } from "..";
import { Disc } from "../domain/model/turn/disc";

// this is a trick to calculate the type when compiling
const client = hc<AppTypes>("");
type Client = typeof client;

const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppTypes>(...args);

export const appClient = hcWithType("", {
  headers: { "Content-Type": "application/json" },
});

export const convertToDiscLabel = (disc: number | undefined) => {
  switch (disc) {
    case 0:
      return "Empty";
    case 1:
      return "Black";
    case 2:
      return "White";
    default:
      return "";
  }
};
