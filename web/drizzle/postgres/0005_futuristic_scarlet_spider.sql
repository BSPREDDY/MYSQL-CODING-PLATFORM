ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "reg_no" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "section" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_changed" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_changed" SET NOT NULL;