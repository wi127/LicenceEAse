/*
  Warnings:

  - You are about to drop the column `clientId` on the `Company` table. All the data in the column will be lost.
  - Added the required column `operatorId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_clientId_fkey";

-- AlterTable
ALTER TABLE "public"."Company" DROP COLUMN "clientId",
ADD COLUMN     "operatorId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
