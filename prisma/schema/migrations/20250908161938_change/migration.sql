/*
  Warnings:

  - The values [LICENSE_APPLICATION] on the enum `ENotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `applicationId` on the `ApplicationDocument` table. All the data in the column will be lost.
  - You are about to drop the column `documentId` on the `ApplicationDocument` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `ApplicationDocument` table. All the data in the column will be lost.
  - You are about to drop the `License` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LicenseApplication` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `ApplicationDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licenseTypeId` to the `ApplicationDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file` to the `RequiredDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ENotificationType_new" AS ENUM ('APPLICATION_STATUS', 'PAYMENT_STATUS', 'SYSTEM');
ALTER TABLE "public"."Notification" ALTER COLUMN "type" TYPE "public"."ENotificationType_new" USING ("type"::text::"public"."ENotificationType_new");
ALTER TYPE "public"."ENotificationType" RENAME TO "ENotificationType_old";
ALTER TYPE "public"."ENotificationType_new" RENAME TO "ENotificationType";
DROP TYPE "public"."ENotificationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."ApplicationDocument" DROP CONSTRAINT "ApplicationDocument_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApplicationDocument" DROP CONSTRAINT "ApplicationDocument_documentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."License" DROP CONSTRAINT "License_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LicenseApplication" DROP CONSTRAINT "LicenseApplication_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LicenseApplication" DROP CONSTRAINT "LicenseApplication_licenseTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_applicationId_fkey";

-- DropIndex
DROP INDEX "public"."ApplicationDocument_applicationId_documentId_key";

-- AlterTable
ALTER TABLE "public"."ApplicationDocument" DROP COLUMN "applicationId",
DROP COLUMN "documentId",
DROP COLUMN "fileUrl",
ADD COLUMN     "companyId" UUID NOT NULL,
ADD COLUMN     "licenseTypeId" UUID NOT NULL,
ADD COLUMN     "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."RequiredDocument" ADD COLUMN     "file" BYTEA NOT NULL;

-- DropTable
DROP TABLE "public"."License";

-- DropTable
DROP TABLE "public"."LicenseApplication";

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "processingTime" INTEGER NOT NULL,
    "applicationFee" DOUBLE PRECISION NOT NULL,
    "licenseFee" DOUBLE PRECISION NOT NULL,
    "validityMonths" INTEGER NOT NULL,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_licenseTypeId_fkey" FOREIGN KEY ("licenseTypeId") REFERENCES "public"."Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."ApplicationDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
