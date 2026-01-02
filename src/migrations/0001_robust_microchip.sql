ALTER TABLE "session" DROP CONSTRAINT "session_id_unique";--> statement-breakpoint
ALTER TABLE "session" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_token_unique" UNIQUE("token");