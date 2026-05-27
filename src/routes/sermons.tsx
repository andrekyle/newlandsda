import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import {
  Play,
  User,
  Search,
  Video,
  Youtube,
  Plus,
  Trash2,
} from "lucide-react";
import * as React from "react";
import { useMemo, useState } from "react";
import { EditableText } from "@/components/Editable";
import { useAdmin, useOverride } from "@/lib/admin";
import { sermons as staticSermons, type Sermon } from "@/data/sermons";
import sermonsBanner from "@/assets/sermons.jpg";

const CHANNEL_URL = "https://www.youtube.com/@JoburgNorthSDA";

/** Extract an 11-char YouTube video ID from a URL or raw ID. */
function parseVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const m = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

function thumbnailFor(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function embedFor(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export const Route = createFileRoute("/sermons")({
  component: Sermons,
  head: () => ({
    meta: [
      { title: "Sermons — Newlands SDA Church" },
      {
        name: "description",
        content:
          "Watch and listen to recent sermons from Newlands Seventh-day Adventist Church.",
      },
    ],
  }),
});

function Sermons() {
  const { editMode } = useAdmin();
  const [extras, setExtras] = useOverride<Sermon[]>("sermons.extras", []);
  const [deletedIds, setDeletedIds] = useOverride<string[]>(
    "sermons.deleted",
    [],
  );

  const sermons = useMemo(() => {
    const merged = [...extras, ...staticSermons];
    const seen = new Set<string>();
    const unique: Sermon[] = [];
    for (const s of merged) {
      if (!seen.has(s.id) && !deletedIds.includes(s.id)) {
        seen.add(s.id);
        unique.push(s);
      }
    }
    return unique.sort((a, b) =>
      a.publishedAt < b.publishedAt ? 1 : -1,
    );
  }, [extras, deletedIds]);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => {
    if (!sermons.length) return null;
    return sermons.find((s) => s.id === selectedId) ?? sermons[0];
  }, [sermons, selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sermons;
    return sermons.filter((s) =>
      [s.title, s.speaker, s.scripture, s.series].some((f) =>
        f.toLowerCase().includes(q),
      ),
    );
  }, [query, sermons]);

  const deleteSermon = (id: string) => {
    if (!confirm("Delete this sermon? This is local to your browser.")) return;
    const nextExtras = extras.filter((s) => s.id !== id);
    if (nextExtras.length !== extras.length) setExtras(nextExtras);
    if (!deletedIds.includes(id)) setDeletedIds([...deletedIds, id]);
    if (selectedId === id) setSelectedId(null);
  };

  // --- Add-new-sermon form state (only shown in edit mode) ---
  const [draftUrl, setDraftUrl] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSpeaker, setDraftSpeaker] = useState("");
  const [draftDate, setDraftDate] = useState(""); // YYYY-MM-DD
  const [draftScripture, setDraftScripture] = useState("");
  const [draftSeries, setDraftSeries] = useState("Sermon");
  const [draftError, setDraftError] = useState<string | null>(null);

  const addSermon = (e: React.FormEvent) => {
    e.preventDefault();
    setDraftError(null);
    const videoId = parseVideoId(draftUrl);
    if (!videoId) {
      setDraftError("Enter a valid YouTube URL or 11-character video ID.");
      return;
    }
    if (
      extras.some((s) => s.id === videoId) ||
      staticSermons.some((s) => s.id === videoId)
    ) {
      setDraftError("A sermon with that video ID already exists.");
      return;
    }
    const iso = draftDate || new Date().toISOString().slice(0, 10);
    const display = (() => {
      const [y, m, d] = iso.split("-").map(Number);
      const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
      return dt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    })();
    const entry: Sermon = {
      id: videoId,
      title: draftTitle.trim() || "Untitled sermon",
      speaker: draftSpeaker.trim() || "Newlands SDA",
      date: display,
      publishedAt: iso,
      scripture: draftScripture.trim(),
      series: draftSeries.trim() || "Sermon",
    };
    setExtras([entry, ...extras]);
    setSelectedId(videoId);
    setDraftUrl("");
    setDraftTitle("");
    setDraftSpeaker("");
    setDraftDate("");
    setDraftScripture("");
    setDraftSeries("Sermon");
  };

  return (
    <PageShell>
      <PageHero
        title="Sermons"
        subtitle="Bible-based messages from Newlands SDA Church."
        image={sermonsBanner}
        overlay={false}
      />

      {/* Channel CTA */}
      <section className="mx-auto max-w-5xl px-4 pt-10 flex justify-center">
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 font-medium rounded-none text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          <Youtube className="h-4 w-4" /> Visit Our YouTube Channel
        </a>
      </section>

      {/* Player */}
      {selected ? (
        <section className="mx-auto max-w-5xl px-4 py-12">
          <div className="bg-card border border-border/50 rounded-sm shadow-sm overflow-hidden">
            <div className="aspect-video bg-black">
              <iframe
                key={selected.id}
                src={embedFor(selected.id)}
                title={selected.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6 border-t border-border/50">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                <EditableText
                  id={`sermon.${selected.id}.series`}
                  defaultValue={selected.series}
                  as="span"
                />{" "}
                ·{" "}
                <EditableText
                  id={`sermon.${selected.id}.date`}
                  defaultValue={selected.date}
                  as="span"
                />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mt-1">
                <EditableText
                  id={`sermon.${selected.id}.title`}
                  defaultValue={selected.title}
                  as="span"
                />
              </h2>
              <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-4">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <EditableText
                    id={`sermon.${selected.id}.speaker`}
                    defaultValue={selected.speaker}
                    as="span"
                  />
                </span>
                <span className="italic">
                  <EditableText
                    id={`sermon.${selected.id}.scripture`}
                    defaultValue={selected.scripture}
                    as="span"
                  />
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="text-muted-foreground">
            No sermons yet.
            {editMode ? " Add one below." : ""}
          </p>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Youtube className="h-4 w-4" /> Open the channel on YouTube
          </a>
        </section>
      )}

      {/* Add-new form (admin only) */}
      {editMode && (
        <section className="mx-auto max-w-5xl px-4 pb-8">
          <form
            onSubmit={addSermon}
            className="bg-card border border-border/50 p-6 rounded-sm shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 text-primary">
              <Plus className="h-4 w-4" />
              <h3 className="font-semibold">Add a sermon</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="block text-muted-foreground mb-1">
                  YouTube URL or video ID *
                </span>
                <input
                  value={draftUrl}
                  onChange={(e) => setDraftUrl(e.target.value)}
                  placeholder="https://youtu.be/abc123XYZ_0"
                  className="w-full bg-background border border-border/50 px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </label>
              <label className="text-sm">
                <span className="block text-muted-foreground mb-1">Title</span>
                <input
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full bg-background border border-border/50 px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <label className="text-sm">
                <span className="block text-muted-foreground mb-1">Speaker</span>
                <input
                  value={draftSpeaker}
                  onChange={(e) => setDraftSpeaker(e.target.value)}
                  className="w-full bg-background border border-border/50 px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <label className="text-sm">
                <span className="block text-muted-foreground mb-1">Date</span>
                <input
                  type="date"
                  value={draftDate}
                  onChange={(e) => setDraftDate(e.target.value)}
                  className="w-full bg-background border border-border/50 px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <label className="text-sm">
                <span className="block text-muted-foreground mb-1">
                  Scripture
                </span>
                <input
                  value={draftScripture}
                  onChange={(e) => setDraftScripture(e.target.value)}
                  placeholder="John 3:16"
                  className="w-full bg-background border border-border/50 px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <label className="text-sm">
                <span className="block text-muted-foreground mb-1">Series</span>
                <select
                  value={draftSeries}
                  onChange={(e) => setDraftSeries(e.target.value)}
                  className="w-full bg-background border border-border/50 px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option>Sermon</option>
                  <option>Live Stream</option>
                  <option>Sabbath School</option>
                  <option>Vespers</option>
                  <option>Special</option>
                </select>
              </label>
            </div>
            {draftError && (
              <p className="text-sm text-destructive">{draftError}</p>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" /> Add sermon
            </button>
            <p className="text-xs text-muted-foreground">
              Added sermons are stored locally in this browser. To make them
              permanent for all visitors, add the entry to{" "}
              <code className="font-mono">src/data/sermons.ts</code>.
            </p>
          </form>
        </section>
      )}

      {/* Search + list */}
      {sermons.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="mb-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, speaker, scripture, or series…"
              className="w-full bg-card border border-border/50 pl-10 pr-4 py-3 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              No sermons match your search.
            </p>
          ) : (
            <ul className="divide-y divide-border/50 border border-border/50 rounded-sm bg-card overflow-hidden">
              {filtered.map((s) => {
                const active = selected != null && s.id === selected.id;
                return (
                  <li key={s.id} className="flex items-stretch">
                    <button
                      onClick={() => setSelectedId(s.id)}
                      className={`flex-1 text-left px-5 py-4 flex items-center gap-4 hover:bg-muted transition-colors ${active ? "bg-muted" : ""}`}
                    >
                      <div
                        className={`h-14 w-24 rounded-sm overflow-hidden shrink-0 bg-muted relative ${active ? "ring-2 ring-primary" : ""}`}
                      >
                        <img
                          src={thumbnailFor(s.id)}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          {active ? (
                            <Video className="h-5 w-5 text-white drop-shadow" />
                          ) : (
                            <Play className="h-5 w-5 text-white drop-shadow" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                          {s.date} · {s.series}
                        </div>
                        <div className="text-lg font-semibold tracking-tight truncate">
                          {s.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-x-3">
                          <span>{s.speaker}</span>
                          {s.scripture && (
                            <span className="italic">{s.scripture}</span>
                          )}
                        </div>
                      </div>
                    </button>
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => deleteSermon(s.id)}
                        title="Delete sermon"
                        className="px-4 text-muted-foreground hover:text-destructive transition-colors border-l border-border/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </PageShell>
  );
}
