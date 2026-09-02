import Link from "next/link";
import { UnnCrest } from "@/components/unn-crest";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "#research", label: "Research catalogue" },
      { href: "#equipment", label: "Equipment booking" },
      { href: "#join", label: "Researcher directory" },
      { href: "#about", label: "About this portal" },
    ],
  },
  {
    title: "Faculties",
    links: [
      { href: "#research", label: "Agriculture" },
      { href: "#research", label: "College of Medicine" },
      { href: "#research", label: "Engineering" },
      { href: "#research", label: "Arts & African Studies" },
    ],
  },
  {
    title: "Office",
    links: [
      { href: "#join", label: "ORID Nsukka" },
      { href: "#join", label: "Ethics & integrity" },
      { href: "#join", label: "TETFund desk" },
      { href: "#join", label: "Contact research office" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="about" className="mt-auto scroll-mt-32 bg-unn-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_repeat(3,0.7fr)] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <UnnCrest className="h-12 w-auto" />
            <span>
              <span className="block font-serif text-lg">UNN Research</span>
              <span className="block text-xs uppercase tracking-[0.16em] text-unn-gold-soft">
                University of Nigeria
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
            The official research management portal of the University of Nigeria,
            Nsukka. Built for scholars who keep the motto — to restore the dignity
            of man — in the laboratory as well as the lecture hall.
          </p>
          <p className="mt-4 text-sm text-white/60">
            Nsukka, Enugu State, Nigeria
            <br />
            research@unn.edu.ng
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-unn-gold-soft">
              {column.title}
            </p>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} University of Nigeria. All rights reserved.
          </p>
          <p>Research Management · Nsukka campus</p>
        </div>
      </div>
    </footer>
  );
}
