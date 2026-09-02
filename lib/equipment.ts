import "server-only";

import type {
  Equipment,
  EquipmentAvailability,
  EquipmentCondition,
} from "@/lib/generated/prisma/client";
import type {
  AdminEquipmentRow,
  EquipmentAvailabilityLabel,
  EquipmentConditionLabel,
  UpdateResearcherEquipmentInput,
} from "@/lib/equipment-shared";
import { prisma } from "@/lib/prisma";

export type {
  AdminEquipmentRow,
  EquipmentAvailabilityLabel,
  EquipmentConditionLabel,
  UpdateResearcherEquipmentInput,
} from "@/lib/equipment-shared";

const availabilityLabels: Record<EquipmentAvailability, string> = {
  AVAILABLE: "Available",
  IN_USE: "In use",
  MAINTENANCE: "Maintenance",
};

const availabilityValues: Record<EquipmentAvailabilityLabel, EquipmentAvailability> = {
  Available: "AVAILABLE",
  "In use": "IN_USE",
  Maintenance: "MAINTENANCE",
};

const conditionLabels: Record<EquipmentCondition, string> = {
  AVAILABLE: "Available",
  IN_USE: "In-use",
  UNDER_REPAIR: "Under-repair",
  DAMAGED: "Damaged",
};

const conditionValues: Record<EquipmentConditionLabel, EquipmentCondition> = {
  Available: "AVAILABLE",
  "In-use": "IN_USE",
  "Under-repair": "UNDER_REPAIR",
  Damaged: "DAMAGED",
};

const availabilityWindowFallback: Record<EquipmentAvailability, string> = {
  AVAILABLE: "Book through your lab coordinator",
  IN_USE: "Currently in use",
  MAINTENANCE: "Under maintenance",
};

type EquipmentWithCustodian = Equipment & {
  custodian: { name: string } | null;
};

export function toAdminEquipmentRow(item: EquipmentWithCustodian): AdminEquipmentRow {
  return {
    id: item.reference ?? item.id,
    name: item.name,
    lab: item.lab ?? "Campus laboratory",
    location: item.location ?? "University of Nigeria, Nsukka",
    availability: availabilityLabels[item.availability],
    window: item.availabilityNote ?? availabilityWindowFallback[item.availability],
    custodian: item.custodian?.name ?? "—",
  };
}

export async function getAdminEquipment(): Promise<AdminEquipmentRow[]> {
  const items = await prisma.equipment.findMany({
    include: { custodian: true },
    orderBy: { createdAt: "desc" },
  });

  return items.map(toAdminEquipmentRow);
}

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

async function getResearcherProjectIds(researcherName: string): Promise<string[]> {
  const key = normalizeName(researcherName);
  const projects = await prisma.research.findMany({
    select: {
      id: true,
      principalResearcherName: true,
      coResearchers: { select: { name: true } },
    },
  });

  return projects
    .filter(
      (project) =>
        normalizeName(project.principalResearcherName) === key ||
        project.coResearchers.some((person) => normalizeName(person.name) === key),
    )
    .map((project) => project.id);
}

async function findResearcherOwnedEquipment(
  identifier: string,
  researcherId: string,
  researcherName: string,
) {
  const projectIds = await getResearcherProjectIds(researcherName);

  return prisma.equipment.findFirst({
    where: {
      AND: [
        { OR: [{ reference: identifier }, { id: identifier }] },
        {
          OR: [
            { custodianId: researcherId },
            ...(projectIds.length > 0
              ? [{ researchLinks: { some: { researchId: { in: projectIds } } } }]
              : []),
          ],
        },
      ],
    },
    include: { custodian: true },
  });
}

export async function updateResearcherEquipment(
  identifier: string,
  researcherId: string,
  researcherName: string,
  input: UpdateResearcherEquipmentInput,
) {
  const existing = await findResearcherOwnedEquipment(identifier, researcherId, researcherName);
  if (!existing) {
    throw new Error("Forbidden: you cannot edit this equipment.");
  }

  const updated = await prisma.equipment.update({
    where: { id: existing.id },
    data: {
      name: input.name.trim(),
      model: input.model.trim() || null,
      make: input.make.trim() || null,
      lab: input.lab.trim() || null,
      location: input.location.trim() || null,
      availability: availabilityValues[input.availability],
      availabilityNote: input.availabilityNote.trim() || null,
      condition: conditionValues[input.condition],
    },
    include: { custodian: true },
  });

  return toResearcherEquipmentRow(updated, researcherId);
}

export function toResearcherEquipmentRow(
  item: Equipment & { custodian: { name: string } | null },
  researcherId: string,
) {
  return {
    id: item.reference ?? item.id,
    name: item.name,
    model: item.model ?? "",
    make: item.make ?? "",
    lab: item.lab ?? "Campus laboratory",
    location: item.location ?? "University of Nigeria, Nsukka",
    availability: availabilityLabels[item.availability],
    availabilityNote: item.availabilityNote ?? "",
    window:
      item.availabilityNote ??
      ({
        AVAILABLE: "Book through your lab coordinator",
        IN_USE: "Currently in use",
        MAINTENANCE: "Under maintenance",
      }[item.availability]),
    condition: conditionLabels[item.condition],
    custodian: item.custodian?.name ?? "—",
    isCustodian: item.custodianId === researcherId,
  };
}
