import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { CalendarDays, FileText, Plus, Trash2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { EditableText, EditableImage } from "@/components/Editable";
import { useAdmin, useOverride } from "@/lib/admin";
import bannerDefault from "@/assets/bulliten.png";
import {
  bulletins as staticBulletins,
  getBulletin,
  type Bulletin,
  type BulletinAnnouncement,
} from "@/data/bulletins";

type BulletinSearch = { date?: string };

export const Route = createFileRoute("/bulletin")({
  component: BulletinPage,
  validateSearch: (search: Record<string, unknown>): BulletinSearch => ({
    date: typeof search.date === "string" ? search.date : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Weekly Bulletin — Newlands SDA Church" },
      {
        name: "description",
        content:
          "Stay informed with our latest announcements, service order, and prayer requests for the upcoming Sabbath at Newlands SDA Church.",
      },
    ],
  }),
});

function nextSaturday(fromIsoDate: string): string {
  // Parse YYYY-MM-DD as a local date and add 7 days.
  const [y, m, d] = fromIsoDate.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + 7);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatBulletinLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function BulletinPage() {
  const { date } = Route.useSearch();
  const { editMode } = useAdmin();
  const navigate = useNavigate();
  const [extras, setExtras] = useOverride<Bulletin[]>("bulletin.extras", []);
  const [deletedDates, setDeletedDates] = useOverride<string[]>("bulletin.deleted", []);

  // Merge user-added bulletins with the static ones (newest first by date).
  const allBulletins = React.useMemo(() => {
    const merged = [...extras, ...staticBulletins];
    // De-duplicate by date — extras win.
    const seen = new Set<string>();
    const unique: Bulletin[] = [];
    for (const b of merged) {
      if (!seen.has(b.date) && !deletedDates.includes(b.date)) {
        seen.add(b.date);
        unique.push(b);
      }
    }
    return unique.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [extras, deletedDates]);

  const bulletin: Bulletin =
    (date ? allBulletins.find((b) => b.date === date) : undefined) ??
    allBulletins[0] ??
    getBulletin(date);

  const addNextWeek = () => {
    const base = bulletin ?? allBulletins[0];
    if (!base) return;
    const newDate = nextSaturday(base.date);
    if (allBulletins.some((b) => b.date === newDate)) {
      navigate({ to: "/bulletin", search: { date: newDate } });
      return;
    }
    // Deep-clone the base bulletin so the new entry can be edited independently.
    const copy: Bulletin = JSON.parse(JSON.stringify(base));
    copy.date = newDate;
    copy.label = formatBulletinLabel(newDate);
    setExtras([copy, ...extras]);
    navigate({ to: "/bulletin", search: { date: newDate } });
  };

  const deleteBulletin = (target: Bulletin) => {
    if (!confirm(`Delete the bulletin for ${target.label}? This is local to your browser.`)) {
      return;
    }
    // Remove from extras if present.
    const nextExtras = extras.filter((b) => b.date !== target.date);
    if (nextExtras.length !== extras.length) {
      setExtras(nextExtras);
    }
    // Always also record as deleted, so static bulletins stay hidden too.
    if (!deletedDates.includes(target.date)) {
      setDeletedDates([...deletedDates, target.date]);
    }
    // If we just deleted the currently-viewed one, jump to the latest remaining.
    if (bulletin.date === target.date) {
      const remaining = allBulletins.filter((b) => b.date !== target.date);
      const next = remaining[0];
      navigate({ to: "/bulletin", search: next ? { date: next.date } : {} });
    }
  };

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative bg-card overflow-hidden">
        <div className="absolute inset-0">
          <EditableImage
            id="pagehero.bulletin.image"
            defaultSrc={bannerDefault}
            alt=""
            className="h-full w-full object-cover opacity-70"
            wrapperClassName="block h-full w-full"
          />
          <div aria-hidden className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4 text-white/80">
              <CalendarDays className="h-5 w-5" />
              <span className="text-lg font-medium">{bulletin.label}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2">
              Weekly Bulletin
            </h1>
            <p className="text-lg text-white/80">{bulletin.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-3/4 space-y-8">
            {/* Service Panel */}
            <div className="bg-card text-card-foreground border border-border/50 shadow-sm p-6">
              <h2 className="font-semibold text-xl mb-4 text-primary">Service Panel</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bulletin.panel.map((person, pIdx) => (
                  <div
                    key={`${person.name}-${person.role}`}
                    className="relative aspect-square overflow-hidden bg-muted flex items-end"
                  >
                    <EditableImage
                      id={`bulletin.${bulletin.date}.panel.${pIdx}.image`}
                      defaultSrc={`data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%232a2a2a'/><text x='50%' y='54%' font-family='sans-serif' font-size='72' fill='%23888' text-anchor='middle' dominant-baseline='middle'>${person.name.split(/\s+/).map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase()}</text></svg>`)}`}
                      alt={person.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      wrapperClassName="absolute inset-0"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="relative p-5 text-white">
                      <p className="font-semibold text-xl leading-tight">
                        <EditableText
                          id={`bulletin.${bulletin.date}.panel.${pIdx}.name`}
                          defaultValue={person.name}
                        />
                      </p>
                      <p className="text-base text-white/80 mt-1">
                        <EditableText
                          id={`bulletin.${bulletin.date}.panel.${pIdx}.role`}
                          defaultValue={person.role}
                        />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <AnnouncementsSection bulletin={bulletin} editMode={editMode} />

            {/* Services */}
            <div className="bg-card text-card-foreground border border-border/50 shadow-sm p-6">
              <h2 className="font-semibold text-xl mb-6 text-primary">Services</h2>
              <div className="space-y-8">
                {bulletin.services.map((s, idx) => (
                  <section key={s.name}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                      <h3 className="font-semibold text-lg text-foreground">
                        <EditableText
                          id={`bulletin.${bulletin.date}.service.${idx}.name`}
                          defaultValue={s.name}
                        />
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        <EditableText
                          id={`bulletin.${bulletin.date}.service.${idx}.time`}
                          defaultValue={s.time}
                        />
                      </span>
                    </div>
                    {s.deacons && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          Deacons &amp; Deaconesses:{" "}
                        </span>
                        <span className="text-sm text-foreground">
                          <EditableText
                            id={`bulletin.${bulletin.date}.service.${idx}.deacons`}
                            defaultValue={s.deacons}
                          />
                        </span>
                      </div>
                    )}
                    {s.notes && (
                      <p className="text-muted-foreground leading-relaxed">
                        <EditableText
                          id={`bulletin.${bulletin.date}.service.${idx}.notes`}
                          defaultValue={s.notes}
                          multiline
                        />
                      </p>
                    )}
                    {idx < bulletin.services.length - 1 && (
                      <hr className="mt-6 border-border" />
                    )}
                  </section>
                ))}
              </div>
            </div>

            {/* Mission Video */}
            <MissionVideo bulletinDate={bulletin.date} defaultUrl={bulletin.missionVideo} />
          </div>

          {/* Sidebar: previous bulletins */}
          <aside className="lg:w-1/4">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Previous Bulletins</h3>
                {editMode && (
                  <button
                    type="button"
                    onClick={addNextWeek}
                    className="w-full mb-4 inline-flex items-center justify-center gap-2 bg-black/90 hover:bg-black/95 text-white/95 border border-white/15 hover:border-white/30 px-3 py-2 text-sm font-semibold rounded-none"
                  >
                    <Plus className="h-4 w-4" /> Add next Sabbath
                  </button>
                )}
                <div className="space-y-3">
                  {allBulletins.map((b) => {
                    const isActive = b.date === bulletin.date;
                    return (
                      <div key={b.date} className="relative group">
                        <Link
                          to="/bulletin"
                          search={{ date: b.date }}
                          className="block"
                        >
                          <div
                            className={`border shadow-sm overflow-hidden transition-colors ${
                              isActive
                                ? "border-primary bg-primary/5"
                                : "bg-card border-border/50 hover:border-primary/50"
                            }`}
                          >
                            <div className="p-4 flex items-center gap-3">
                              <FileText
                                className={`h-5 w-5 shrink-0 ${
                                  isActive ? "text-primary" : "text-muted-foreground"
                                }`}
                              />
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`font-medium text-sm ${
                                    isActive ? "text-primary" : "text-foreground"
                                  }`}
                                >
                                  {b.label}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {b.subtitle}
                                </p>
                              </div>
                              {editMode && <span className="w-7 shrink-0" aria-hidden />}
                            </div>
                          </div>
                        </Link>
                        {editMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteBulletin(b);
                            }}
                            title={`Delete ${b.label}`}
                            className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 text-red-500 hover:text-white hover:bg-red-500 border border-red-500/60 rounded-none transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

/** Normalize a YouTube URL (watch / youtu.be / embed) to a valid /embed/ form. */
function toEmbedUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return "";
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
    }
    return url;
  } catch {
    return url;
  }
}

function AnnouncementsSection({
  bulletin,
  editMode,
}: {
  bulletin: Bulletin;
  editMode: boolean;
}) {
  const [extras, setExtras] = useOverride<BulletinAnnouncement[]>(
    `bulletin.${bulletin.date}.extraAnnouncements`,
    [],
  );

  const items: Array<{ a: BulletinAnnouncement; idx: number; extraIdx: number | null }> = [
    ...bulletin.announcements.map((a, idx) => ({ a, idx, extraIdx: null as number | null })),
    ...extras.map((a, i) => ({
      a,
      idx: bulletin.announcements.length + i,
      extraIdx: i,
    })),
  ];

  const addAnnouncement = () => {
    setExtras([
      ...extras,
      { title: "New Announcement", body: ["Add details here."] },
    ]);
  };

  const deleteExtra = (extraIdx: number, title: string) => {
    if (!confirm(`Delete announcement "${title}"? This is local to your browser.`)) return;
    setExtras(extras.filter((_, i) => i !== extraIdx));
  };

  return (
    <div className="bg-card text-card-foreground border border-border/50 shadow-sm p-6">
      <h2 className="font-semibold text-xl mb-4 text-primary">Announcements</h2>
      <div className="space-y-6">
        {items.map(({ a, idx, extraIdx }, pos) => (
          <div key={`${idx}-${a.title}`} className="relative group">
            <h3 className="font-semibold text-lg mb-2 text-foreground pr-10">
              <EditableText
                id={`bulletin.${bulletin.date}.announcement.${idx}.title`}
                defaultValue={a.title}
              />
            </h3>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              {a.body.map((p, i) => (
                <p key={i}>
                  <EditableText
                    id={`bulletin.${bulletin.date}.announcement.${idx}.body.${i}`}
                    defaultValue={p}
                    multiline
                  />
                </p>
              ))}
            </div>
            {editMode && extraIdx !== null && (
              <button
                type="button"
                onClick={() => deleteExtra(extraIdx, a.title)}
                title={`Delete "${a.title}"`}
                className="absolute top-0 right-0 p-1.5 text-red-500 hover:text-white hover:bg-red-500 border border-red-500/60 rounded-none transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
            {pos < items.length - 1 && <hr className="mt-6 border-border" />}
          </div>
        ))}
      </div>
      {editMode && (
        <div className="mt-6">
          <button
            type="button"
            onClick={addAnnouncement}
            className="inline-flex items-center gap-2 bg-black/90 hover:bg-black/95 text-white/95 border border-white/15 hover:border-white/30 px-3 py-2 text-sm font-semibold rounded-none"
          >
            <Plus className="h-4 w-4" />
            Add announcement
          </button>
        </div>
      )}
    </div>
  );
}

function MissionVideo({
  bulletinDate,
  defaultUrl,
}: {
  bulletinDate: string;
  defaultUrl?: string;
}) {
  const { editMode } = useAdmin();
  const [url, setUrl] = useOverride<string>(
    `bulletin.${bulletinDate}.missionVideo`,
    defaultUrl ?? "",
  );

  if (!editMode && !url) return null;

  const embed = toEmbedUrl(url);

  return (
    <div className="bg-card text-card-foreground border border-border/50 shadow-sm p-6">
      <h2 className="font-semibold text-xl mb-4 text-primary">Mission Video</h2>
      {editMode && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            YouTube URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="w-full text-sm bg-black/90 text-white/95 border border-white/15 hover:border-white/25 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 rounded-none px-2 py-1"
          />
        </div>
      )}
      {embed ? (
        <div className="relative w-full aspect-video overflow-hidden">
          <iframe
            src={embed}
            title="Mission Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : (
        editMode && (
          <p className="text-sm text-muted-foreground">
            Paste a YouTube URL above to embed a video.
          </p>
        )
      )}
    </div>
  );
}
