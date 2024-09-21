ALTER TABLE "reversible"."squares" DROP CONSTRAINT "squares_turn_id_games_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reversible"."squares" ADD CONSTRAINT "squares_turn_id_turns_id_fk" FOREIGN KEY ("turn_id") REFERENCES "reversible"."turns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
