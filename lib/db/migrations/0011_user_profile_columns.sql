-- Add profile columns to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" varchar(100);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" text;
