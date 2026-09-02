import { getNameInitials } from "@/lib/format-relative-time";

export type ResearcherNavItem = {
  href: string;
  label: string;
  segment: string;
};

export type ResearcherProfileContext = {
  name: string;
  email: string;
  faculty: string;
  reference: string | null;
  initials: string;
};

export function buildResearcherProfileContext(profile: {
  name: string;
  email: string;
  faculty: string;
  reference: string | null;
}): ResearcherProfileContext {
  return {
    ...profile,
    initials: getNameInitials(profile.name),
  };
}

const navSegments = [
  { segment: "", label: "Overview" },
  { segment: "research", label: "My research" },
  { segment: "equipment", label: "Equipment" },
  { segment: "profile", label: "Profile" },
] as const;

export const RESEARCHER_BASE_PATH = "/researcher";

export function getResearcherNav(): ResearcherNavItem[] {
  return navSegments.map(({ segment, label }) => ({
    segment,
    label,
    href: segment ? `${RESEARCHER_BASE_PATH}/${segment}` : RESEARCHER_BASE_PATH,
  }));
}

export function getResearcherPageTitle(pathname: string): string {
  const item = getResearcherNav().find(
    (entry) =>
      entry.href === pathname ||
      (entry.segment !== "" && pathname.startsWith(`${RESEARCHER_BASE_PATH}/${entry.segment}`)),
  );
  return item?.label ?? "Researcher";
}

export function researcherPath(segment: string): string {
  return segment ? `${RESEARCHER_BASE_PATH}/${segment}` : RESEARCHER_BASE_PATH;
}
