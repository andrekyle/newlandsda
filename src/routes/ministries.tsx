import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { EditableText, EditableImage } from "@/components/Editable";
import { ArrowRight } from "lucide-react";
import { ministries } from "@/data/ministries";

/** 1×1 transparent PNG — used as the default tile image so the gradient + icon show through until an admin uploads a photo. */
const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export const Route = createFileRoute("/ministries")({
  component: Ministries,
  head: () => ({
    meta: [
      { title: "Ministries — Newlands SDA Church" },
      {
        name: "description",
        content:
          "Discover the ministries of Newlands SDA — Sabbath School, Youth, Pathfinders, Health, Women's, Men's, Family Life, Stewardship and more.",
      },
    ],
  }),
});

function Ministries() {
  return (
    <PageShell>
      <PageHero
        title="Our Ministries"
        subtitle="There is a place for everyone to grow, serve, and belong at Newlands SDA. Explore each ministry below."
        overlay={false}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {ministries.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.id}
                to="/ministries/$ministryId"
                params={{ ministryId: m.id }}
                className="group flex flex-col bg-card border border-border/50 rounded-sm overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div
                  className={`relative aspect-video bg-linear-to-br ${m.gradient} flex items-center justify-center`}
                >
                  {/* Admin-uploadable tile photo — layered above the gradient.
                      Defaults to transparent so the gradient + icon are visible
                      until a photo is provided. */}
                  <div className="absolute inset-0">
                    <EditableImage
                      id={`ministries.${m.id}.tile.image`}
                      defaultSrc={TRANSPARENT_PIXEL}
                      alt=""
                      className="h-full w-full object-cover"
                      wrapperClassName="block h-full w-full"
                    />
                  </div>
                  <Icon className="relative h-14 w-14 text-white/90" aria-hidden />
                </div>
                <div className="flex-1 flex flex-col p-6">
                  <h2 className="text-xl font-semibold tracking-tight">
                    <EditableText id={`ministries.${m.id}.title`} defaultValue={m.title} as="span" />
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground flex-1">
                    <EditableText id={`ministries.${m.id}.short`} defaultValue={m.short} as="span" multiline />
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
