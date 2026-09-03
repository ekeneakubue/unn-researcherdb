export type HomeResearchProject = {
  id: string;
  title: string;
  faculty: string;
  lead: string;
  unit: string;
  year: string;
  summary: string;
  status: string;
};

export type HomePerson = {
  name: string;
  email: string;
};

export type HomeResearchDetail = {
  id: string;
  title: string;
  abstract: string;
  startDate: string;
  endDate: string;
  principalResearcher: string;
  principalResearcherEmail: string;
  coResearchers: HomePerson[];
  collaborators: HomePerson[];
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

export type HomeEquipmentItem = {
  id: string;
  name: string;
  lab: string;
  location: string;
  availability: string;
  window: string;
};

export type HomeEquipmentDetail = {
  id: string;
  name: string;
  model: string;
  make: string;
  lab: string;
  location: string;
  availability: string;
  availabilityNote: string;
  condition: string;
  custodian: string;
  linkedResearch: string[];
};
