/*
  Warnings:

  - Changed the type of `documentType` on the `RequiredDocument` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."RequiredDocument" DROP COLUMN "documentType",
ADD COLUMN     "documentType" "public"."EDocumentType" NOT NULL;
