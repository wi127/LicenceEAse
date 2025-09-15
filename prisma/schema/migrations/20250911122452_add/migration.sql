/*
  Warnings:

  - A unique constraint covering the columns `[stripeIntentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "paidAtStripe" TIMESTAMP(3),
ADD COLUMN     "stripeIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeIntentId_key" ON "public"."Payment"("stripeIntentId");
