-- CreateEnum
CREATE TYPE "FacultyUnitType" AS ENUM ('FACULTY', 'CENTER', 'INSTITUTE', 'SCHOOL', 'COLLEGE');

-- AlterTable
ALTER TABLE "faculties" ADD COLUMN "type" "FacultyUnitType" NOT NULL DEFAULT 'FACULTY';
