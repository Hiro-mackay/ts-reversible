CREATE SCHEMA "reversible";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reversible"."game_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" serial NOT NULL,
	"winner" integer NOT NULL,
	"ended_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reversible"."games" (
	"id" serial PRIMARY KEY NOT NULL,
	"started_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reversible"."moves" (
	"id" serial PRIMARY KEY NOT NULL,
	"turn_id" serial NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"disc" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reversible"."squares" (
	"id" serial PRIMARY KEY NOT NULL,
	"turn_id" serial NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"disc" integer NOT NULL,
	CONSTRAINT "squares_turn_id_x_y_unique" UNIQUE("turn_id","x","y")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reversible"."turns" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" serial NOT NULL,
	"turn_count" integer NOT NULL,
	"next_disc" integer,
	"ended_at" timestamp,
	CONSTRAINT "turns_id_game_id_unique" UNIQUE("id","game_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reversible"."game_results" ADD CONSTRAINT "game_results_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "reversible"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reversible"."moves" ADD CONSTRAINT "moves_turn_id_turns_id_fk" FOREIGN KEY ("turn_id") REFERENCES "reversible"."turns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reversible"."squares" ADD CONSTRAINT "squares_turn_id_games_id_fk" FOREIGN KEY ("turn_id") REFERENCES "reversible"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reversible"."turns" ADD CONSTRAINT "turns_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "reversible"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
