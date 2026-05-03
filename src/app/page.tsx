import { FeaturedCompetitionsSection, LaunchSportsSection } from "./components/public-sections";
import { SiteShell } from "./components/site-shell";

export default function Home() {
  return <SiteShell>
    <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-14">
      <div className="flex flex-col justify-center">
        <p className="mb-4 text-sm font-bold uppercase text-[color:var(--accent-strong)]">
          Scoreline launch desk
        </p>
        <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal sm:text-6xl">
          Sports updates, live scores, and World Cup coverage
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          A clean global sports desk for match updates, fixtures, results,
          standings, and original editorial across the games people follow
          every day.
        </p>

        <LaunchSportsSection />
      </div>

      <aside className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow)]">
        <h2 className="text-sm font-black uppercase text-[color:var(--muted)]">
          Top right now
        </h2>
        <div className="mt-4 divide-y divide-[color:var(--line)]">
          {[
            {
              competition: "World Cup",
              fixture: "Group stage watchlist",
              status: "Building hub",
            },
            {
              competition: "Champions League",
              fixture: "Final form tracker",
              status: "Monitoring",
            },
            {
              competition: "NBA",
              fixture: "Playoff pulse",
              status: "Trending",
            },
          ].map((event) => (
            <article className="py-4" key={`${event.competition}-${event.fixture}`}>
              <p className="text-sm font-bold text-[color:var(--accent-strong)]">
                {event.competition}
              </p>
              <h3 className="mt-1 text-lg font-black">{event.fixture}</h3>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                {event.status}
              </p>
            </article>
          ))}
        </div>
      </aside>
    </section>

    <FeaturedCompetitionsSection />
  </SiteShell>;
}
