/*
  Warnings:

  - The values [ARCHIVED] on the enum `ENotificationStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `requiredDocumentId` to the `ApplicationDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."EAppSettingType" ADD VALUE 'USER_DELETE';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ENotificationStatus_new" AS ENUM ('UNREAD', 'READ');
ALTER TABLE "public"."Notification" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Notification" ALTER COLUMN "status" TYPE "public"."ENotificationStatus_new" USING ("status"::text::"public"."ENotificationStatus_new");
ALTER TYPE "public"."ENotificationStatus" RENAME TO "ENotificationStatus_old";
ALTER TYPE "public"."ENotificationStatus_new" RENAME TO "ENotificationStatus";
DROP TYPE "public"."ENotificationStatus_old";
ALTER TABLE "public"."Notification" ALTER COLUMN "status" SET DEFAULT 'UNREAD';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."ApplicationDocument" DROP CONSTRAINT "ApplicationDocument_applicationId_fkey";

-- AlterTable
ALTER TABLE "public"."ApplicationDocument" ADD COLUMN     "requiredDocumentId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_requiredDocumentId_fkey" FOREIGN KEY ("requiredDocumentId") REFERENCES "public"."RequiredDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
