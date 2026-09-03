import { Suspense } from "react";
import {
  ResearcherMenuProvider,
  ResearcherPortalProvider,
  ResearcherSidebar,
  ResearcherTopbar,
} from "@/components/researcher/researcher-shell";
import type { ResearcherProfileContext } from "@/lib/researcher-portal-config";

export function ResearcherLayout({
  profile,
  children,
}: {
  profile: ResearcherProfileContext;
  children: React.ReactNode;
}) {
  return (
    <ResearcherPortalProvider profile={profile}>
      <ResearcherMenuProvider>
        <div className="flex min-h-full flex-1 bg-unn-cream">
          <Suspense fallback={<div className="hidden w-64 shrink-0 bg-unn-green lg:block" />}>
            <ResearcherSidebar />
          </Suspense>
          <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
            <Suspense
              fallback={
                <header className="h-[4.25rem] border-b border-unn-green/10 bg-unn-cream" />
              }
            >
              <ResearcherTopbar />
            </Suspense>
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </ResearcherMenuProvider>
    </ResearcherPortalProvider>
  );
}
