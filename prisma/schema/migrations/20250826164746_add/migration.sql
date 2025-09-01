/*
  Warnings:

  - Made the column `address` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailCompany` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Company" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "emailCompany" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
