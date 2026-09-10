import { EquipmentSection } from "@/components/equipment-section";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { ResearchCards } from "@/components/research-cards";
import { ResearcherCta } from "@/components/researcher-cta";
import { ServiceErrorHost } from "@/components/service-error-host";
import { getFacultyCatalog } from "@/lib/faculties";
import type { FacultyCatalog } from "@/lib/faculties-shared";
import { getHomeEquipmentItems, getHomeResearchProjects } from "@/lib/home";
import { runSafeAll } from "@/lib/safe-server";

const emptyCatalog: FacultyCatalog = {
  faculties: [],
  departmentsByFaculty: {},
};

export default async function Home() {
  const { results, errors } = await runSafeAll([
    {
      label: "Research projects",
      run: getHomeResearchProjects,
      fallback: [],
    },
    {
      label: "Equipment",
      run: getHomeEquipmentItems,
      fallback: [],
    },
    {
      label: "Faculties",
      run: getFacultyCatalog,
      fallback: emptyCatalog,
    },
  ] as const);

  const [projects, equipment, catalog] = results;

  return (
    <>
      <a
        href="#research"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to research
      </a>
      <Navbar />
      <main>
        <Hero />
        <ResearchCards projects={projects} />
        <EquipmentSection items={equipment} />
        <ResearcherCta catalog={catalog} />
      </main>
      <Footer />
      <ServiceErrorHost errors={errors} />
    </>
  );
}
