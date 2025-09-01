/*
  Warnings:

  - Added the required column `updatedAt` to the `RequiredDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."RequiredDocument" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "image" TEXT;
