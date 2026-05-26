import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PageShell, PageHero } from "@/components/PageShell";
import { Play, User, Search, Video, Youtube, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

const CHANNEL_ID = "UCRsK1USoQS7quKLVZ_itPPA"; // @JoburgNorthSDA
const CHANNEL_URL = "https://www.youtube.com/@JoburgNorthSDA";

type Sermon = {
  id: string;
  title: string;
  speaker: string;
  date: string;
  publishedAt: string;
  scripture: string;
  series: string;
  videoUrl: string;
  thumbnail: string;
};

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'");
}

function pick(re: RegExp, source: string): string {
  const m = source.match(re);
  return m ? decodeEntities(m[1].trim()) : "";
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function extractScripture(text: string): string {
  if (!text) return "";
  const m = text.match(
    /\b((?:[1-3]\s)?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)\s+\d+(?::\d+(?:[-\u2013]\d+)?)?)\b/i,
  );
  return m ? m[1] : "";
}

export const fetchChannelSermons = createServerFn({ method: "GET" }).handler(async () => {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 NewlandsSDA-site" },
    });
    if (!res.ok) return { sermons: [] as Sermon[], error: `Feed returned ${res.status}` };
    const xml = await res.text();

    const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
    const sermons: Sermon[] = [];
    let m: RegExpExecArray | null;
    while ((m = entryRe.exec(xml)) !== null) {
      const block = m[1];
      const videoId = pick(/<yt:videoId>([^<]+)<\/yt:videoId>/, block);
      if (!videoId) continue;
      const title = pick(/<title>([\s\S]*?)<\/title>/, block);
      const published = pick(/<published>([^<]+)<\/published>/, block);
      const author = pick(/<author>[\s\S]*?<name>([^<]+)<\/name>[\s\S]*?<\/author>/, block);
      const thumbnail =
        pick(/<media:thumbnail[^>]*url="([^"]+)"/, block) ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      const description = pick(/<media:description>([\s\S]*?)<\/media:description>/, block);

      const isLiveStream = /live\s*stream/i.test(title);
      const series = isLiveStream ? "Live Stream" : "Sermon";
      const scripture = extractScripture(`${title}\n${description}`);

      sermons.push({
        id: videoId,
        title,
        speaker: author || "Newlands SDA",
        date: formatDate(published),
        publishedAt: published,
        scripture,
        series,
        videoUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnail,
      });
    }

    sermons.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    return { sermons, error: null as string | null };
  } catch (err) {
    return { sermons: [] as Sermon[], error: (err as Error).message };
  }
});

export const Route = createFileRoute("/sermons")({
  component: Sermons,
  loader: async () => await fetchChannelSermons(),
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
  const { sermons, error } = Route.useLoaderData();
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

  return (
    <PageShell>
      <PageHero
        title="Sermons"
        subtitle="Bible-based messages from our YouTube channel, updated automatically."
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
                src={selected.videoUrl}
                title={selected.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6 border-t border-border/50">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                {selected.series} · {selected.date}
              </div>
              <h2 className="text-2xl font-semibold tracking-tight mt-1">{selected.title}</h2>
              <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-4">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {selected.speaker}
                </span>
                {selected.scripture && <span className="italic">{selected.scripture}</span>}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            {error
              ? `Couldn't load videos from the channel (${error}).`
              : "No videos found on the channel yet."}
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
                  <li key={s.id}>
                    <button
                      onClick={() => setSelectedId(s.id)}
                      className={`w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-muted transition-colors ${active ? "bg-muted" : ""}`}
                    >
                      <div
                        className={`h-14 w-24 rounded-sm overflow-hidden shrink-0 bg-muted relative ${active ? "ring-2 ring-primary" : ""}`}
                      >
                        <img
                          src={s.thumbnail}
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
                          {s.scripture && <span className="italic">{s.scripture}</span>}
                        </div>
                      </div>
                    </button>
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
