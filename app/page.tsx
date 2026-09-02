import { EquipmentSection } from "@/components/equipment-section";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { ResearchCards } from "@/components/research-cards";
import { ResearcherCta } from "@/components/researcher-cta";
import { getHomeEquipmentItems, getHomeResearchProjects } from "@/lib/home";

export default async function Home() {
  const [projects, equipment] = await Promise.all([
    getHomeResearchProjects(),
    getHomeEquipmentItems(),
  ]);

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
        <ResearcherCta />
      </main>
      <Footer />
    </>
  );
}
