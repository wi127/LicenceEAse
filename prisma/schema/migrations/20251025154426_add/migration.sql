-- AlterTable
ALTER TABLE "public"."ApplicationDocument" ALTER COLUMN "extractedJson" DROP NOT NULL,
ALTER COLUMN "rawOcrText" DROP NOT NULL,
ALTER COLUMN "reason" DROP NOT NULL;
