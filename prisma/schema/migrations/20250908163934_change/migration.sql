/*
  Warnings:

  - You are about to drop the column `licenseTypeId` on the `ApplicationDocument` table. All the data in the column will be lost.
  - Added the required column `applicationId` to the `ApplicationDocument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ApplicationDocument" DROP CONSTRAINT "ApplicationDocument_licenseTypeId_fkey";

-- AlterTable
ALTER TABLE "public"."ApplicationDocument" DROP COLUMN "licenseTypeId",
ADD COLUMN     "applicationId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
