ALTER TABLE "users" ADD COLUMN "reg_no" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "section" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_changed" boolean DEFAULT false;