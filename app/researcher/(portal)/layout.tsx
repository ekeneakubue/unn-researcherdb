import type { Metadata } from "next";
import { ResearcherLayout } from "@/components/researcher/researcher-layout";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { prisma } from "@/lib/prisma";
import { buildResearcherProfileContext } from "@/lib/researcher-portal-config";
import { logServiceFailure } from "@/lib/service-error";

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

  let photoUrl: string | null = null;
  try {
    const researcher = await prisma.researcher.findUnique({
      where: { id: session.researcherId },
      select: { photoUrl: true },
    });
    photoUrl = researcher?.photoUrl ?? null;
  } catch (error) {
    // Don't take down the whole portal when Neon is cold/unreachable.
    logServiceFailure("Researcher photo", error);
  }

  return (
    <ResearcherLayout
      profile={buildResearcherProfileContext({
        name: session.name,
        email: session.email,
        faculty: session.faculty,
        reference: session.reference,
        photoUrl,
      })}
    >
      {children}
    </ResearcherLayout>
  );
}
