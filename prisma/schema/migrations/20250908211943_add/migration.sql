/*
  Warnings:

  - The values [Business_PLAN] on the enum `EDocumentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EDocumentType_new" AS ENUM ('BUSINESS_PLAN', 'RDB_CERTIFICATE', 'COMPANY_CONTRACT', 'OTHER_DOCUMENT');
ALTER TABLE "public"."RequiredDocument" ALTER COLUMN "documentType" TYPE "public"."EDocumentType_new" USING ("documentType"::text::"public"."EDocumentType_new");
ALTER TYPE "public"."EDocumentType" RENAME TO "EDocumentType_old";
ALTER TYPE "public"."EDocumentType_new" RENAME TO "EDocumentType";
DROP TYPE "public"."EDocumentType_old";
COMMIT;
