/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EUserRole" AS ENUM ('USER', 'ADMIN', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."EUserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isOAuth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "public"."EUserStatus" NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "public"."EUserRole" NOT NULL DEFAULT 'UNKNOWN';

-- DropEnum
DROP TYPE "public"."UserRole";
