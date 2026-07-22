-- Phase One: make public lead/event writes idempotent and observable without
-- deleting or rewriting existing business data.

BEGIN;

ALTER TYPE "LeadSource" RENAME VALUE 'WEBSITE' TO 'CONTACT';
ALTER TYPE "LeadSource" ADD VALUE 'CHAT';

CREATE TYPE "LeadNotificationStatus" AS ENUM (
    'NOT_CONFIGURED',
    'PENDING',
    'SENT',
    'FAILED'
);

ALTER TABLE "Lead"
    ADD COLUMN "conversationId" TEXT,
    ADD COLUMN "idempotencyKey" TEXT,
    ADD COLUMN "requestFingerprint" TEXT,
    ADD COLUMN "traceId" TEXT;

ALTER TABLE "Conversation"
    ADD COLUMN "version" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "SegmentEvent"
    ADD COLUMN "eventId" TEXT;

CREATE TABLE "LeadNotification" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'WEBHOOK',
    "status" "LeadNotificationStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "lastErrorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadNotification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Lead_conversationId_key" ON "Lead"("conversationId");
CREATE UNIQUE INDEX "Lead_idempotencyKey_key" ON "Lead"("idempotencyKey");
CREATE UNIQUE INDEX "Lead_traceId_key" ON "Lead"("traceId");
CREATE UNIQUE INDEX "SegmentEvent_eventId_key" ON "SegmentEvent"("eventId");
CREATE UNIQUE INDEX "LeadNotification_leadId_channel_key"
    ON "LeadNotification"("leadId", "channel");
CREATE INDEX "LeadNotification_status_createdAt_idx"
    ON "LeadNotification"("status", "createdAt");

ALTER TABLE "Lead"
    ADD CONSTRAINT "Lead_conversationId_fkey"
    FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LeadNotification"
    ADD CONSTRAINT "LeadNotification_leadId_fkey"
    FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
