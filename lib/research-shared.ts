export type ResearchPersonInput = {
  name: string;
  email: string;
};

export type NewResearch = {
  title: string;
  abstract: string;
  startDate: string;
  endDate: string;
  principalResearcher: string;
  principalResearcherEmail: string;
  coResearchers: ResearchPersonInput[];
  collaborators: ResearchPersonInput[];
  researchArea: string;
  faculty: string;
  department: string;
  researchOutput: "Articles" | "Papers" | "Journal" | "Patents/Innovation";
  funding: string;
  equipment: {
    name: string;
    model: string;
    make: string;
    location: string;
    condition: "Available" | "In-use" | "Under-repair" | "Damaged";
  };
};

export type AdminResearchRow = {
  id: string;
  title: string;
  faculty: string;
  lead: string;
  unit: string;
  year: string;
  status: string;
  funding: string;
};

export type AdminResearchDetail = {
  id: string;
  title: string;
  abstract: string;
  startDate: string;
  endDate: string;
  principalResearcher: string;
  principalResearcherEmail: string;
  coResearchers: ResearchPersonInput[];
  collaborators: ResearchPersonInput[];
  researchArea: string;
  faculty: string;
  department: string;
  researchOutput: string;
  funding: string;
  status: string;
  equipment: Array<{
    name: string;
    model: string;
    make: string;
    location: string;
    condition: string;
  }>;
};

export const researchStatusOptions = [
  "Active",
  "Recruiting",
  "Under review",
  "Completed",
] as const;

export type ResearchStatusLabel = (typeof researchStatusOptions)[number];

export type CreateAdminResearchInput = NewResearch;
