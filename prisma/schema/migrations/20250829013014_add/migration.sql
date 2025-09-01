/*
  Warnings:

  - Made the column `legalType` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Company" ALTER COLUMN "legalType" SET NOT NULL;
