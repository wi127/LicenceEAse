/*
  Warnings:

  - Added the required column `extractedJson` to the `ApplicationDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawOcrText` to the `ApplicationDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `ApplicationDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ApplicationDocument" ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "extractedJson" JSONB NOT NULL,
ADD COLUMN     "rawOcrText" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL;
