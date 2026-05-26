import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import { getEvent, events, type ChurchEvent } from "@/data/events";
import { useOverride } from "@/lib/admin";

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetail,
  loader: ({ params }) => {
    // Don't throw notFound() here — user-added events live in localStorage
    // and aren't visible during SSR. The component resolves them client-side.
    return { eventId: params.eventId, event: getEvent(params.eventId) ?? null };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.event?.title ?? "Event"} — Newlands SDA Church` },
      { name: "description", content: loaderData?.event?.short ?? "" },
    ],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 bg-primary text-primary-foreground px-5 py-2.5 font-medium rounded-none text-sm hover:opacity-90 transition-opacity">Try again</button>
        </div>
      </PageShell>
    );
  },
});

function EventDetail() {
  const { eventId, event: staticEvent } = Route.useLoaderData() as { eventId: string; event: ChurchEvent | null };
  const [extras] = useOverride<ChurchEvent[]>("events.extras", []);
  const [deletedIds] = useOverride<string[]>("events.deleted", []);

  const event: ChurchEvent | undefined =
    extras.find((e) => e.id === eventId) ??
    (staticEvent && !deletedIds.includes(staticEvent.id) ? staticEvent : undefined);

  if (!event) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Event not found</h1>
          <p className="mt-3 text-muted-foreground">We couldn't find that event.</p>
          <Link to="/events" className="mt-6 inline-block text-primary font-medium hover:opacity-80 transition-opacity">&larr; All events</Link>
        </div>
      </PageShell>
    );
  }

  const others = [...extras, ...events]
    .filter((e) => e.id !== event.id && !deletedIds.includes(e.id))
    .slice(0, 3);

  return (
    <PageShell>
      <section className="relative bg-card overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <Link to="/events" className="inline-flex items-center gap-2 text-sm text-primary mb-6 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4" /> All Events
          </Link>
          {event.featured && (
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Featured Event</div>
          )}
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">{event.title}</h1>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {event.date}</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {event.time}</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {event.location}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2 space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">About this event</h2>
          {event.description.map((p, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
          ))}

          {event.schedule && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold tracking-tight mb-4">Schedule</h3>
              <ul className="divide-y divide-border/50 border border-border/50 rounded-sm overflow-hidden">
                {event.schedule.map((s) => (
                  <li key={s.time} className="flex gap-6 px-4 py-3">
                    <span className="font-medium text-primary w-20 shrink-0">{s.time}</span>
                    <span className="text-foreground">{s.item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="bg-card border border-border/50 p-6 rounded-sm">
            <h3 className="text-lg font-semibold tracking-tight mb-3">Location</h3>
            <p className="text-sm text-muted-foreground mb-3">{event.address}</p>
            <div className="aspect-video border border-border/50 rounded-sm overflow-hidden">
              <iframe
                title={`Map of ${event.location}`}
                src={`https://www.google.com/maps?q=${event.mapQuery}&output=embed`}
                className="w-full h-full"
                loading="lazy"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${event.mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              Get directions &rarr;
            </a>
          </div>
        </aside>
      </section>

      {others.length > 0 && (
        <section className="bg-card border-t border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-semibold tracking-tight mb-8">More events</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {others.map((e) => (
                <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className="block bg-background border border-border/50 p-6 rounded-sm hover:border-primary/50 transition-colors">
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary">{e.date}</div>
                  <h3 className="text-lg font-semibold tracking-tight mt-2">{e.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.short}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
