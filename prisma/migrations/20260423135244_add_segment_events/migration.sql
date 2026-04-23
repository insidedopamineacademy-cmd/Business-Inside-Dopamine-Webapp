-- AlterTable
ALTER TABLE "Faq" RENAME CONSTRAINT "FAQ_pkey" TO "Faq_pkey";

-- CreateTable
CREATE TABLE "SegmentEvent" (
    "id" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SegmentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SegmentEvent_segment_idx" ON "SegmentEvent"("segment");

-- CreateIndex
CREATE INDEX "SegmentEvent_createdAt_idx" ON "SegmentEvent"("createdAt" DESC);
