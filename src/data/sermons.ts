/**
 * Curated list of sermons. Admins can also add / edit / hide entries from
 * the Sermons page itself (changes are stored in localStorage via the
 * Editable / override system). This list is the baseline shipped with the
 * site so visitors see something even before any admin edits.
 *
 * Each entry's `id` is the 11-character YouTube video ID. The thumbnail
 * and embed URL are derived from it automatically in the route.
 */
export type Sermon = {
  /** YouTube video ID (11 chars, the part after `?v=` or `youtu.be/`). */
  id: string;
  title: string;
  speaker: string;
  /** Human-readable date shown on the card, e.g. "3 May 2026". */
  date: string;
  /** ISO date used for sorting (newest first). */
  publishedAt: string;
  /** Optional Bible reference, shown italicised next to the speaker. */
  scripture: string;
  /** Short label such as "Sermon", "Live Stream", "Sabbath School". */
  series: string;
};

export const sermons: Sermon[] = [
  {
    id: "Me7A9wekMjs",
    title: "Sabbath Worship Service",
    speaker: "Newlands SDA",
    date: "16 May 2026",
    publishedAt: "2026-05-16",
    scripture: "",
    series: "Sermon",
  },
  {
    id: "p2NHdTXBWq0",
    title: "Sabbath Live Stream",
    speaker: "Newlands SDA",
    date: "9 May 2026",
    publishedAt: "2026-05-09",
    scripture: "",
    series: "Live Stream",
  },
];
