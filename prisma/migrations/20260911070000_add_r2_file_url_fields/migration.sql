-- AlterTable
ALTER TABLE "researchers" ADD COLUMN "photoUrl" TEXT;

-- AlterTable
ALTER TABLE "research" ADD COLUMN "documentUrl" TEXT,
ADD COLUMN "documentName" TEXT;

-- AlterTable
ALTER TABLE "equipment" ADD COLUMN "photoUrl" TEXT;
