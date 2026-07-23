-- Phase 2.3C: persist list-level message counts without reading transcripts.
-- The equality constraint makes every future transcript write maintain the count.

BEGIN;

ALTER TABLE "Conversation"
    ADD COLUMN "messageCount" INTEGER NOT NULL DEFAULT 0;

UPDATE "Conversation"
SET "messageCount" = CASE
    WHEN jsonb_typeof("messages") = 'array' THEN jsonb_array_length("messages")
    ELSE 0
END;

ALTER TABLE "Conversation"
    ADD CONSTRAINT "Conversation_messageCount_matches_messages_check"
    CHECK (
        "messageCount" = CASE
            WHEN jsonb_typeof("messages") = 'array' THEN jsonb_array_length("messages")
            ELSE 0
        END
    );

CREATE INDEX "Conversation_createdAt_id_idx"
    ON "Conversation"("createdAt" DESC, "id" DESC);

COMMIT;
