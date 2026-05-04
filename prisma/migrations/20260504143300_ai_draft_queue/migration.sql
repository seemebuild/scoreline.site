-- CreateEnum
CREATE TYPE "AiDraftStatus" AS ENUM ('review', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "AiDraft" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerVariant" TEXT NOT NULL,
    "sourceUrls" JSONB NOT NULL,
    "sourceRecordIds" JSONB NOT NULL,
    "status" "AiDraftStatus" NOT NULL DEFAULT 'review',
    "notes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiDraft_status_createdAt_idx" ON "AiDraft"("status", "createdAt");

-- CreateIndex
CREATE INDEX "AiDraft_provider_providerVariant_idx" ON "AiDraft"("provider", "providerVariant");
