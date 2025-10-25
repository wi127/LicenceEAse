/*
  Warnings:

  - You are about to drop the column `companyId` on the `ApplicationDocument` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ApplicationDocument" DROP CONSTRAINT "ApplicationDocument_companyId_fkey";

-- AlterTable
ALTER TABLE "public"."ApplicationDocument" DROP COLUMN "companyId";
