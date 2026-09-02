import type { Metadata } from "next";
import { ResearcherLayout } from "@/components/researcher/researcher-layout";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { buildResearcherProfileContext } from "@/lib/researcher-portal-config";

export const metadata: Metadata = {
  title: "Researcher — UNN Research",
  description: "Your UNN research workspace for projects, equipment, and profile.",
};

export default async function ResearcherPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireResearcherSession();

  return (
    <ResearcherLayout
      profile={buildResearcherProfileContext({
        name: session.name,
        email: session.email,
        faculty: session.faculty,
        reference: session.reference,
      })}
    >
      {children}
    </ResearcherLayout>
  );
}
