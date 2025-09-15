/*
  Warnings:

  - You are about to drop the column `documentId` on the `Application` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_documentId_fkey";

-- AlterTable
ALTER TABLE "public"."Application" DROP COLUMN "documentId";

-- CreateTable
CREATE TABLE "public"."_ApplicationToRequiredDocument" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ApplicationToRequiredDocument_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ApplicationToRequiredDocument_B_index" ON "public"."_ApplicationToRequiredDocument"("B");

-- AddForeignKey
ALTER TABLE "public"."_ApplicationToRequiredDocument" ADD CONSTRAINT "_ApplicationToRequiredDocument_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ApplicationToRequiredDocument" ADD CONSTRAINT "_ApplicationToRequiredDocument_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."RequiredDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
