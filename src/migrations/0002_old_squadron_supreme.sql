CREATE TYPE "public"."device_type" AS ENUM('desktop', 'mobile', 'tablet', 'unknown');--> statement-breakpoint
CREATE TABLE "geo_info" (
	"id" text PRIMARY KEY NOT NULL,
	"ip" "inet" NOT NULL,
	"country_code" text,
	"region" text,
	"latitude" real,
	"longitude" real,
	"timezone" text,
	"offset" integer,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "geo_info_ip_unique" UNIQUE("ip")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"user_id" text,
	"geo_info_id" text,
	"user_agent_id" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "session_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "user_agent" (
	"id" text PRIMARY KEY NOT NULL,
	"user_agent" text,
	"device_type" "device_type",
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_geo_info_id_geo_info_id_fk" FOREIGN KEY ("geo_info_id") REFERENCES "public"."geo_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_agent_id_user_agent_id_fk" FOREIGN KEY ("user_agent_id") REFERENCES "public"."user_agent"("id") ON DELETE no action ON UPDATE no action;