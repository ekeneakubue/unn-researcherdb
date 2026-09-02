-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'OFFICER');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ResearcherRole" AS ENUM ('ACADEMIC_STAFF', 'RESEARCH_FELLOW', 'POSTGRADUATE_RESEARCHER', 'EXTERNAL_COLLABORATOR');

-- CreateEnum
CREATE TYPE "ResearchStatus" AS ENUM ('ACTIVE', 'RECRUITING', 'UNDER_REVIEW', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ResearchOutputType" AS ENUM ('ARTICLES', 'PAPERS', 'JOURNAL', 'PATENTS_INNOVATION');

-- CreateEnum
CREATE TYPE "EquipmentCondition" AS ENUM ('AVAILABLE', 'IN_USE', 'UNDER_REPAIR', 'DAMAGED');

-- CreateEnum
CREATE TYPE "EquipmentAvailability" AS ENUM ('AVAILABLE', 'IN_USE', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "reference" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OFFICER',
    "status" "AccountStatus" NOT NULL DEFAULT 'PENDING',
    "unit" TEXT,
    "lastActiveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "researchers" (
    "id" TEXT NOT NULL,
    "reference" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "role" "ResearcherRole" NOT NULL DEFAULT 'ACADEMIC_STAFF',
    "status" "AccountStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "researchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research" (
    "id" TEXT NOT NULL,
    "reference" TEXT,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "researchArea" TEXT NOT NULL,
    "facultyCenterInstitute" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "researchOutput" "ResearchOutputType" NOT NULL DEFAULT 'ARTICLES',
    "funding" TEXT NOT NULL,
    "status" "ResearchStatus" NOT NULL DEFAULT 'UNDER_REVIEW',
    "principalResearcherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_co_researchers" (
    "researchId" TEXT NOT NULL,
    "researcherId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "research_co_researchers_pkey" PRIMARY KEY ("researchId","researcherId")
);

-- CreateTable
CREATE TABLE "research_collaborators" (
    "id" TEXT NOT NULL,
    "researchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "researcherId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "research_collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "reference" TEXT,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "make" TEXT,
    "lab" TEXT,
    "location" TEXT,
    "condition" "EquipmentCondition" NOT NULL DEFAULT 'AVAILABLE',
    "availability" "EquipmentAvailability" NOT NULL DEFAULT 'AVAILABLE',
    "availabilityNote" TEXT,
    "custodianId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_equipment" (
    "researchId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "condition" "EquipmentCondition" NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,

    CONSTRAINT "research_equipment_pkey" PRIMARY KEY ("researchId","equipmentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_reference_key" ON "users"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "researchers_reference_key" ON "researchers"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "researchers_email_key" ON "researchers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "research_reference_key" ON "research"("reference");

-- CreateIndex
CREATE INDEX "research_status_idx" ON "research"("status");

-- CreateIndex
CREATE INDEX "research_principalResearcherId_idx" ON "research"("principalResearcherId");

-- CreateIndex
CREATE INDEX "research_collaborators_researchId_idx" ON "research_collaborators"("researchId");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_reference_key" ON "equipment"("reference");

-- CreateIndex
CREATE INDEX "equipment_availability_idx" ON "equipment"("availability");

-- AddForeignKey
ALTER TABLE "research" ADD CONSTRAINT "research_principalResearcherId_fkey" FOREIGN KEY ("principalResearcherId") REFERENCES "researchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_co_researchers" ADD CONSTRAINT "research_co_researchers_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_co_researchers" ADD CONSTRAINT "research_co_researchers_researcherId_fkey" FOREIGN KEY ("researcherId") REFERENCES "researchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_collaborators" ADD CONSTRAINT "research_collaborators_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_collaborators" ADD CONSTRAINT "research_collaborators_researcherId_fkey" FOREIGN KEY ("researcherId") REFERENCES "researchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_custodianId_fkey" FOREIGN KEY ("custodianId") REFERENCES "researchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_equipment" ADD CONSTRAINT "research_equipment_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_equipment" ADD CONSTRAINT "research_equipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
