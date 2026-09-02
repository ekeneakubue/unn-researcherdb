-- Backfill principal investigator name on research projects
ALTER TABLE "research" ADD COLUMN "principalResearcherName" TEXT;

UPDATE "research" r
SET "principalResearcherName" = res."name"
FROM "researchers" res
WHERE r."principalResearcherId" = res."id";

UPDATE "research"
SET "principalResearcherName" = 'Unknown'
WHERE "principalResearcherName" IS NULL;

ALTER TABLE "research" ALTER COLUMN "principalResearcherName" SET NOT NULL;

-- Replace co-researcher links with name-only rows
CREATE TABLE "research_co_researchers_new" (
  "id" TEXT NOT NULL,
  "researchId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "research_co_researchers_new_pkey" PRIMARY KEY ("id")
);

INSERT INTO "research_co_researchers_new" ("id", "researchId", "name", "sortOrder")
SELECT
  'co_' || rc."researchId" || '_' || rc."researcherId",
  rc."researchId",
  res."name",
  rc."sortOrder"
FROM "research_co_researchers" rc
JOIN "researchers" res ON rc."researcherId" = res."id";

DROP TABLE "research_co_researchers";

ALTER TABLE "research_co_researchers_new" RENAME TO "research_co_researchers";

ALTER TABLE "research_co_researchers"
ADD CONSTRAINT "research_co_researchers_researchId_fkey"
FOREIGN KEY ("researchId") REFERENCES "research"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "research_co_researchers_researchId_idx" ON "research_co_researchers"("researchId");

-- Remove researcher foreign keys from research
ALTER TABLE "research" DROP CONSTRAINT "research_principalResearcherId_fkey";
DROP INDEX "research_principalResearcherId_idx";
ALTER TABLE "research" DROP COLUMN "principalResearcherId";

-- Remove optional researcher link from collaborators
ALTER TABLE "research_collaborators" DROP CONSTRAINT "research_collaborators_researcherId_fkey";
ALTER TABLE "research_collaborators" DROP COLUMN "researcherId";

-- Simplify researcher profiles (home-page signups only)
ALTER TABLE "researchers" DROP COLUMN "role";
DROP TYPE "ResearcherRole";
