/*
  Warnings:

  - Added the required column `companyId` to the `RequiredDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."RequiredDocument" ADD COLUMN     "companyId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."RequiredDocument" ADD CONSTRAINT "RequiredDocument_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
