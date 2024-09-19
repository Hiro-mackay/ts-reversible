import {
  integer,
  pgSchema,
  pgTable,
  serial,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const schema = pgSchema("reversible");

export const games = schema.table("games", {
  id: serial("id").primaryKey(),
  startedAt: timestamp("started_at").defaultNow(),
});

export const turns = schema.table(
  "turns",
  {
    id: serial("id").primaryKey(),
    gameId: serial("game_id").references(() => games.id),
    turnCount: integer("turn_count").notNull(),
    nextDisc: integer("next_disc"),
    endedAt: timestamp("ended_at"),
  },
  (t) => ({
    unq: unique().on(t.id, t.gameId),
  })
);

export const moves = schema.table("moves", {
  id: serial("id").primaryKey(),
  turnId: serial("turn_id").references(() => turns.id),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  disc: integer("disc").notNull(),
});

export const squares = schema.table(
  "squares",
  {
    id: serial("id").primaryKey(),
    turnId: serial("turn_id").references(() => games.id),
    x: integer("x").notNull(),
    y: integer("y").notNull(),
    disc: integer("disc").notNull(),
  },
  (t) => ({
    unq: unique().on(t.turnId, t.x, t.y),
  })
);

export const gameResults = schema.table("game_results", {
  id: serial("id").primaryKey(),
  gameId: serial("game_id").references(() => games.id),
  winner: integer("winner").notNull(),
  endedAt: timestamp("ended_at").notNull(),
});
