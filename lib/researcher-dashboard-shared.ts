export type ResearcherProjectRow = {
  id: string;
  title: string;
  faculty: string;
  department: string;
  role: "Principal" | "Co-researcher";
  status: string;
  year: string;
  funding: string;
};

export type ResearcherEquipmentRow = {
  id: string;
  name: string;
  model: string;
  make: string;
  lab: string;
  location: string;
  availability: string;
  availabilityNote: string;
  window: string;
  condition: string;
  custodian: string;
  isCustodian: boolean;
};

export type ResearcherProfile = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  status: string;
  memberSince: string;
};

export type ResearcherOverviewData = {
  stats: { label: string; value: string; hint: string }[];
  recentProjects: ResearcherProjectRow[];
  custodianEquipment: ResearcherEquipmentRow[];
  availableEquipmentCount: number;
};
