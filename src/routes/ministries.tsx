import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { EditableText } from "@/components/Editable";
import { ArrowRight } from "lucide-react";
import { ministries } from "@/data/ministries";

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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  <Icon className="h-14 w-14 text-white/90" aria-hidden />
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
