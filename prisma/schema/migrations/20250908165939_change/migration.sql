/*
  Warnings:

  - Added the required column `documentId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_companyId_fkey";

-- AlterTable
ALTER TABLE "public"."Application" ADD COLUMN     "documentId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."RequiredDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
