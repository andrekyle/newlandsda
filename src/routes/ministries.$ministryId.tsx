import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { EditableText, EditableImage } from "@/components/Editable";
import { ArrowLeft, ArrowRight, Users, Clock, MapPin } from "lucide-react";
import { getMinistry, ministries } from "@/data/ministries";

/** 1×1 transparent PNG — used as the default banner so the gradient shows through until an admin uploads a real image. */
const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export const Route = createFileRoute("/ministries/$ministryId")({
  component: MinistryDetail,
  loader: ({ params }) => ({
    ministryId: params.ministryId,
    ministry: getMinistry(params.ministryId) ?? null,
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.ministry?.title ?? "Ministry"} — Newlands SDA Church`,
      },
      {
        name: "description",
        content: loaderData?.ministry?.short ?? "",
      },
    ],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="mt-6 bg-primary text-primary-foreground px-5 py-2.5 font-medium rounded-none text-sm hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </PageShell>
    );
  },
});

function MinistryDetail() {
  const { ministry } = Route.useLoaderData();

  if (!ministry) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Ministry not found</h1>
          <p className="mt-3 text-muted-foreground">
            We couldn't find that ministry.
          </p>
          <Link
            to="/ministries"
            className="mt-6 inline-block text-primary font-medium hover:opacity-80 transition-opacity"
          >
            &larr; All ministries
          </Link>
        </div>
      </PageShell>
    );
  }

  const m = ministry;
  const Icon = m.icon;
  const others = ministries.filter((x) => x.id !== m.id).slice(0, 3);

  return (
    <PageShell>
      {/* Hero banner with gradient + icon + optional uploaded image */}
      <section
        className={`relative bg-linear-to-br ${m.gradient} overflow-hidden`}
      >
        {/* Optional admin-uploaded banner image, shown above the gradient */}
        <div className="absolute inset-0">
          <EditableImage
            id={`pagehero.ministry.${m.id}.image`}
            defaultSrc={TRANSPARENT_PIXEL}
            alt=""
            className="h-full w-full object-cover"
            wrapperClassName="block h-full w-full"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-20 md:py-28 text-white">
          <Link
            to="/ministries"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All Ministries
          </Link>
          <div className="flex items-start gap-5">
            <div className="hidden sm:flex h-20 w-20 rounded-sm bg-white/15 backdrop-blur-sm items-center justify-center shrink-0">
              <Icon className="h-10 w-10 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
                <EditableText id={`ministries.${m.id}.title`} defaultValue={m.title} as="span" />
              </h1>
              <p className="mt-3 text-base md:text-lg text-white/90 italic">
                <EditableText
                  id={`ministries.${m.id}.tagline`}
                  defaultValue={m.tagline}
                  as="span"
                  multiline
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-5xl px-4 py-16 grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2 space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">About this ministry</h2>
          {m.description.map((p, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed">
              <EditableText
                id={`ministries.${m.id}.description.${i}`}
                defaultValue={p}
                as="span"
                multiline
              />
            </p>
          ))}

          <div className="mt-8">
            <h3 className="text-xl font-semibold tracking-tight mb-4">What we do</h3>
            <ul className="space-y-3">
              {m.activities.map((a, idx) => (
                <li key={idx} className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1 shrink-0" aria-hidden>
                    &#9679;
                  </span>
                  <span className="flex-1">
                    <EditableText
                      id={`ministries.${m.id}.activity.${idx}`}
                      defaultValue={a}
                      as="span"
                      multiline
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-card border border-border/50 p-6 rounded-sm">
            <h3 className="text-lg font-semibold tracking-tight mb-4">At a glance</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground flex-1">
                  Led by{" "}
                  <EditableText
                    id={`ministries.${m.id}.leader`}
                    defaultValue={m.leader}
                    className="text-foreground font-medium"
                  />
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="flex-1">
                  <EditableText
                    id={`ministries.${m.id}.meets`}
                    defaultValue={m.meets}
                    className="text-muted-foreground"
                  />
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="flex-1">
                  <EditableText
                    id={`ministries.${m.id}.location`}
                    defaultValue={m.location}
                    className="text-muted-foreground"
                  />
                </span>
              </div>
            </dl>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              Get involved <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </section>

      {/* Other ministries */}
      {others.length > 0 && (
        <section className="bg-card border-t border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-semibold tracking-tight mb-8">Other ministries</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {others.map((o) => {
                const OIcon = o.icon;
                return (
                  <Link
                    key={o.id}
                    to="/ministries/$ministryId"
                    params={{ ministryId: o.id }}
                    className="group flex flex-col bg-background border border-border/50 rounded-sm overflow-hidden hover:border-primary/50 transition-colors"
                  >
                    <div
                      className={`relative aspect-video bg-linear-to-br ${o.gradient} flex items-center justify-center`}
                    >
                      <OIcon className="h-10 w-10 text-white/90" aria-hidden />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold tracking-tight">{o.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{o.short}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
