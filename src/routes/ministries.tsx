import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { EditableText, EditableImage } from "@/components/Editable";
import { useAdmin, useOverride } from "@/lib/admin";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { ministries } from "@/data/ministries";
import ministriesBanner from "@/assets/default-banner.jpg";

/** 1×1 transparent PNG — used as the default tile image so the gradient + icon show through until an admin uploads a photo. */
const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

/**
 * Tile visual area for a ministry card. When no custom image has been
 * uploaded, shows the brand gradient with a centered icon. When an admin
 * uploads a photo, hides the gradient + icon and shows the full image on
 * a neutral background (so no gradient color "leaks" around the sides of
 * portraits / non-16:9 photos). In edit mode the upload control is always
 * visible on top of the gradient so admins can add or replace photos.
 */
export function MinistryTileVisual({
  ministryId,
  gradient,
  Icon,
  iconSize = "h-14 w-14",
  defaultImage,
}: {
  ministryId: string;
  gradient: string;
  Icon: LucideIcon;
  iconSize?: string;
  defaultImage?: string;
}) {
  const id = `ministries.${ministryId}.tile.image`;
  const { editMode } = useAdmin();
  const fallback = defaultImage ?? TRANSPARENT_PIXEL;
  const [src] = useOverride<string>(id, fallback);
  const hasImage = src !== TRANSPARENT_PIXEL;

  if (editMode) {
    return (
      <div
        className={`relative aspect-video bg-linear-to-br ${gradient} flex items-center justify-center`}
      >
        <div className="absolute inset-0">
          <EditableImage
            id={id}
            defaultSrc={fallback}
            alt=""
            className="h-full w-full object-cover"
            wrapperClassName="block h-full w-full"
          />
        </div>
        {!hasImage && (
          <Icon className={`relative ${iconSize} text-white/90`} aria-hidden />
        )}
      </div>
    );
  }

  if (hasImage) {
    return (
      <div className="relative w-full bg-muted overflow-hidden">
        <img src={src} alt="" className="block w-full h-auto" loading="lazy" decoding="async" />
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-video bg-linear-to-br ${gradient} flex items-center justify-center`}
    >
      <Icon className={`${iconSize} text-white/90`} aria-hidden />
    </div>
  );
}

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
      <section className="relative bg-background overflow-hidden">
        <img
          src={ministriesBanner}
          alt="Our Ministries"
          className="block w-full h-auto"
          loading="eager"
          fetchPriority="high"
        />
      </section>

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
                <MinistryTileVisual ministryId={m.id} gradient={m.gradient} Icon={Icon} defaultImage={m.bannerImage} />
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
