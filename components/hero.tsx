import Link from "next/link";

const stats = [
  { value: "2,480", label: "On-going research" },
  { value: "186", label: "Completed research" },
  { value: "16", label: "Pending research" },
  { value: "54", label: "Existing equipment" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-unn-green text-white">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-unn-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.2em] text-unn-gold-soft">
            Office of Research, Innovation & Development
          </p>
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            The research memory of the University of Nigeria
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Discover publications, laboratories, and shared equipment across
            Nsukka. One place for faculty, postgraduate scholars, and partners
            to find what the university is working on — and who to work with.
          </p>

          <form
            action="#research"
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 text-left shadow-xl shadow-black/20 sm:flex-row sm:items-center"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search research
            </label>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="Search for existing research, research equipment ..."
              className="h-12 flex-1 rounded-xl bg-transparent px-4 text-sm text-unn-ink outline-none placeholder:text-unn-muted"
            />
            <button
              type="submit"
              className="h-12 rounded-xl bg-unn-gold px-5 text-sm font-semibold text-unn-ink transition-colors hover:bg-unn-gold-soft"
            >
              Search
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="#research"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-unn-green transition-colors hover:bg-unn-gold-soft"
            >
              Explore research
            </Link>
            <Link
              href="#equipment"
              className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse equipment
            </Link>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/15">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-4 sm:px-6 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="text-xs uppercase tracking-[0.16em] text-unn-gold-soft">
                {stat.label}
              </dt>
              <dd className="mt-1 font-serif text-3xl text-white">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
