-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'BOOKED', 'CLOSED');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE');

-- CreateTable
CREATE TABLE "Lead" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "company" TEXT,
  "need" TEXT NOT NULL,
  "bottleneck" TEXT NOT NULL,
  "preferredDate" TEXT,
  "preferredTime" TEXT,
  "notes" TEXT,
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "source" "LeadSource" NOT NULL DEFAULT 'WEBSITE',
  "meetingBooked" BOOLEAN NOT NULL DEFAULT false,
  "meetingDate" TEXT,
  "meetingNotes" TEXT,
  "archived" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead" ("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead" ("status");

-- CreateIndex
CREATE INDEX "Lead_archived_idx" ON "Lead" ("archived");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead" ("email");
