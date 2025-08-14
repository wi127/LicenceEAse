/*
  Warnings:

  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ENotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."ENotificationType" AS ENUM ('LICENSE_APPLICATION', 'PAYMENT_STATUS', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."EAppSettingType" AS ENUM ('PASSWORD_RESET', 'EMAIL_VERIFICATION', 'ACCOUNT_VERIFICATION', 'ACCOUNT_DELETION');

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "status" "public"."ENotificationStatus" NOT NULL DEFAULT 'UNREAD',
ADD COLUMN     "type" "public"."ENotificationType" NOT NULL;

-- CreateTable
CREATE TABLE "public"."AppSetting" (
    "id" UUID NOT NULL,
    "type" "public"."EAppSettingType" NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppSetting_type_idx" ON "public"."AppSetting"("type");

-- CreateIndex
CREATE INDEX "AppSetting_createdAt_idx" ON "public"."AppSetting"("createdAt");
