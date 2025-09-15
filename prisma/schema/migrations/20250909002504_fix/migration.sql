/*
  Warnings:

  - You are about to drop the column `licenseFee` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `ApplicationDocument` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_applicationId_fkey";

-- AlterTable
ALTER TABLE "public"."Application" DROP COLUMN "licenseFee";

-- AlterTable
ALTER TABLE "public"."ApplicationDocument" DROP COLUMN "submittedAt";

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
