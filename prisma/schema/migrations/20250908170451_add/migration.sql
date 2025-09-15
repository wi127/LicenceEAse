/*
  Warnings:

  - Added the required column `documentType` to the `RequiredDocument` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EDocumentType" AS ENUM ('APPLICATION_SERVICE_PROVIDER', 'NETWORK_INFRASTRUCTURE', 'NETWORK_SERVICE_PROVIDER');

-- AlterTable
ALTER TABLE "public"."RequiredDocument" ADD COLUMN     "documentType" TEXT NOT NULL;
