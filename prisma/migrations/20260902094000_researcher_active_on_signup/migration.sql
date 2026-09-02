-- Activate existing researcher signups
UPDATE "researchers" SET "status" = 'ACTIVE' WHERE "status" = 'PENDING';

-- New signups default to active
ALTER TABLE "researchers" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
