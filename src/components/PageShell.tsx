import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { EditableImage, EditableText } from "./Editable";
import defaultBanner from "@/assets/hero-church.jpg";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function PageHero({
  title,
  subtitle,
  image,
  imageId,
  overlay = true,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  imageId?: string;
  /**
   * When false, the eyebrow / title / subtitle text overlay is hidden and
   * the banner image stands on its own. Use this when the uploaded banner
   * already contains its own title art (e.g. a designed marketing banner).
   */
  overlay?: boolean;
}) {
  // Every page now gets a banner. If the page doesn't supply one, we fall
  // back to a shared default — admins can upload a unique banner per page
  // via the EditableImage (each page has its own stable id).
  const bannerSrc = image ?? defaultBanner;
  const id = imageId ?? `pagehero.${slugify(title)}.image`;

  if (!overlay) {
    // Image-only banner: let the image dictate the height via an aspect
    // ratio container, no text overlay, no scrim.
    return (
      <section className="relative bg-card overflow-hidden">
        <div className="aspect-[21/9] sm:aspect-[3/1] lg:aspect-[24/7]">
          <EditableImage
            id={id}
            defaultSrc={bannerSrc}
            alt={title}
            className="h-full w-full object-cover"
            wrapperClassName="block h-full w-full"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-card overflow-hidden">
      <div className="absolute inset-0">
        <EditableImage
          id={id}
          defaultSrc={bannerSrc}
          alt=""
          className="h-full w-full object-cover opacity-70"
          wrapperClassName="block h-full w-full"
        />
        {/* Dark scrim for legible text in both light and dark modes */}
        <div aria-hidden className="absolute inset-0 bg-black/25" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
        <EditableText
          id={`pagehero.${slugify(title)}.eyebrow`}
          defaultValue="Newlands SDA"
          as="div"
          className="text-xs font-semibold uppercase tracking-wide mb-3 text-primary drop-shadow"
        />
        <EditableText
          id={`pagehero.${slugify(title)}.title`}
          defaultValue={title}
          as="h1"
          className="font-serif-display text-4xl md:text-5xl tracking-tight text-white drop-shadow"
        />
        {subtitle && (
          <EditableText
            id={`pagehero.${slugify(title)}.subtitle`}
            defaultValue={subtitle}
            as="p"
            multiline
            className="mt-4 text-lg max-w-2xl mx-auto text-white/85 drop-shadow"
          />
        )}
      </div>
    </section>
  );
}
