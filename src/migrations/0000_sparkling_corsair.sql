CREATE TYPE "public"."browser" AS ENUM('chrome', 'firefox', 'safari', 'edge', 'opera', 'brave', 'other');--> statement-breakpoint
CREATE TYPE "public"."device_type" AS ENUM('desktop', 'mobile', 'tablet', 'bot', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."os" AS ENUM('windows', 'macos', 'linux', 'android', 'ios', 'other');--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_id" text NOT NULL,
	"ip_address" text,
	"isp" text,
	"is_proxy" boolean,
	"is_hosting" boolean,
	"country" text,
	"country_code" text,
	"region" text,
	"region_name" text,
	"city" text,
	"zip" text,
	"latitude" real,
	"longitude" real,
	"timezone" text,
	"user_agent" text,
	"device_type" "device_type",
	"browser" "browser",
	"browser_version" text,
	"os" "os",
	"os_version" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;