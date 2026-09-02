export type ResearcherSignupInput = {
  name: string;
  email: string;
  faculty: string;
  password: string;
};

export type AdminResearcherRow = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  projects: number;
};
