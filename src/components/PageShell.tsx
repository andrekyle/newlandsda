import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { EditableImage, EditableText } from "./Editable";

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

export function PageHero({ title, subtitle, image, imageId }: { title: string; subtitle?: string; image?: string; imageId?: string }) {
  const hasImage = !!image;
  const id = imageId ?? `pagehero.${slugify(title)}.image`;
  return (
    <section className="relative bg-card overflow-hidden">
      {image && (
        <div className="absolute inset-0">
          <EditableImage
            id={id}
            defaultSrc={image}
            alt=""
            className="h-full w-full object-cover opacity-70"
            wrapperClassName="block h-full w-full"
          />
          {/* Dark scrim for legible text in both light and dark modes */}
          <div aria-hidden className="absolute inset-0 bg-black/25" />
        </div>
      )}
      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
        <EditableText
          id={`pagehero.${slugify(title)}.eyebrow`}
          defaultValue="Newlands SDA"
          as="div"
          className={`text-xs font-semibold uppercase tracking-wide mb-3 ${hasImage ? "text-primary drop-shadow" : "text-primary"}`}
        />
        <EditableText
          id={`pagehero.${slugify(title)}.title`}
          defaultValue={title}
          as="h1"
          className={`font-serif-display text-4xl md:text-5xl tracking-tight ${hasImage ? "text-white drop-shadow" : "text-foreground"}`}
        />
        {subtitle && (
          <EditableText
            id={`pagehero.${slugify(title)}.subtitle`}
            defaultValue={subtitle}
            as="p"
            multiline
            className={`mt-4 text-lg max-w-2xl mx-auto ${hasImage ? "text-white/85 drop-shadow" : "text-muted-foreground"}`}
          />
        )}
      </div>
    </section>
  );
}
