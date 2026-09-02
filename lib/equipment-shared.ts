export type AdminEquipmentRow = {
  id: string;
  name: string;
  lab: string;
  location: string;
  availability: string;
  window: string;
  custodian: string;
};

export const equipmentAvailabilityOptions = [
  "Available",
  "In use",
  "Maintenance",
] as const;

export const equipmentConditionOptions = [
  "Available",
  "In-use",
  "Under-repair",
  "Damaged",
] as const;

export type EquipmentAvailabilityLabel = (typeof equipmentAvailabilityOptions)[number];
export type EquipmentConditionLabel = (typeof equipmentConditionOptions)[number];

export type UpdateResearcherEquipmentInput = {
  name: string;
  model: string;
  make: string;
  lab: string;
  location: string;
  availability: EquipmentAvailabilityLabel;
  availabilityNote: string;
  condition: EquipmentConditionLabel;
};
