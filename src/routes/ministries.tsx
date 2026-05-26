import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { EditableText } from "@/components/Editable";
import { BookOpen, Users, Heart, Music, HandHelping, Baby, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/ministries")({
  component: Ministries,
  head: () => ({
    meta: [
      { title: "Ministries — Newlands SDA Church" },
      { name: "description", content: "Discover the ministries of Newlands SDA — Sabbath School, youth, music, community outreach, and more." },
    ],
  }),
});

const ministries = [
  {
    id: "sabbath-school",
    icon: BookOpen,
    title: "Sabbath School",
    tagline: "Bible study for every age, every Sabbath.",
    leader: "Ms Izane Frank",
    meets: "Saturdays · 09:30",
    location: "Main Sanctuary & classrooms",
    description:
      "Sabbath School is the heartbeat of our weekly Bible study — small group classes where members of every age dig into Scripture together, discuss the quarterly lesson, and pray for one another.",
    activities: [
      "Adult lesson study in the main sanctuary",
      "Youth class for ages 13–18 in the upper room",
      "Children's divisions (Beginner, Kindergarten, Primary, Juniors)",
      "Mission story and global focus each week",
    ],
  },
  {
    id: "music",
    icon: Music,
    title: "Music & Worship",
    tagline: "Lifting hearts to God through song.",
    leader: "Sis. P. Mokoena",
    meets: "Rehearsals · Thursdays 18:30",
    location: "Sanctuary",
    description:
      "Our music ministry leads the congregation in worship through the choir, praise team, and instrumental support. We welcome new voices and musicians of every skill level.",
    activities: [
      "Sanctuary choir",
      "Praise & worship team",
      "Special music for Sabbath and events",
      "Youth & children's choirs",
    ],
  },
  {
    id: "children",
    icon: Baby,
    title: "Children's Ministry",
    tagline: "Safe, joyful spaces where children meet Jesus.",
    leader: "Sis. T. Mahlangu",
    meets: "Sabbaths · 09:00 & 11:00",
    location: "Children's wing",
    description:
      "We nurture the youngest members of our church family through age-appropriate Bible lessons, songs, crafts, and play. Every volunteer is vetted and trained in child safeguarding.",
    activities: [
      "Cradle Roll (0–3)",
      "Kindergarten & Primary classes",
      "Vacation Bible School each December",
      "Adventurer Club programme",
    ],
  },
  {
    id: "youth",
    icon: Users,
    title: "Youth Ministry",
    tagline: "Empowering teens and young adults to live boldly for Christ.",
    leader: "Pastor M. Dlamini",
    meets: "Fridays · 18:00 (AY Vespers)",
    location: "Youth hall",
    description:
      "From Pathfinders to Ambassadors, our youth ministry walks alongside young people as they grow in faith, friendship, and purpose. Expect lively worship, honest conversation, and real community.",
    activities: [
      "Friday-night AY (Adventist Youth) vespers",
      "Pathfinder Club (10–15)",
      "Ambassador & Senior Youth groups",
      "Annual youth camp & outreach trips",
    ],
  },
  {
    id: "outreach",
    icon: HandHelping,
    title: "Community Outreach",
    tagline: "Serving our neighbours with practical love.",
    leader: "Bro. J. Sithole",
    meets: "Sundays · monthly outreach",
    location: "Newlands & surrounds",
    description:
      "We believe the gospel has hands and feet. Our outreach team partners with local schools, shelters, and clinics to meet practical needs in Jesus' name.",
    activities: [
      "Monthly food distribution",
      "School-supply drives",
      "Winter blanket campaign",
      "Bible studies in the community",
    ],
  },
  {
    id: "health",
    icon: Heart,
    title: "Health Ministry",
    tagline: "Wholistic health — body, mind, and spirit.",
    leader: "Dr. N. Khumalo",
    meets: "Quarterly expos",
    location: "Church grounds",
    description:
      "Adventists are known for our emphasis on healthful living. Our health ministry hosts free screenings, cooking classes, and wellness talks open to the whole community.",
    activities: [
      "Community health expos",
      "Plant-based cooking demos",
      "Stop-smoking & lifestyle programs",
      "Mental health awareness evenings",
    ],
  },
];

function Ministries() {
  return (
    <PageShell>
      <PageHero title="Our Ministries" subtitle="Many gifts, one body, serving Christ together." />

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ministries.map((m) => (
          <a key={m.id} href={`#${m.id}`} className="bg-card border border-border/50 p-8 rounded-sm hover:border-primary/50 transition-colors block">
            <m.icon className="h-10 w-10 text-primary mb-4" />
            <EditableText id={`ministries.${m.id}.title`} defaultValue={m.title} as="h3" className="text-xl font-semibold tracking-tight mb-2 block" />
            <EditableText id={`ministries.${m.id}.tagline`} defaultValue={m.tagline} as="p" multiline className="text-sm text-muted-foreground leading-relaxed block" />
          </a>
        ))}
      </section>

      {/* Individual sections */}
      <div className="bg-card border-t border-border/50">
        {ministries.map((m, i) => (
          <section
            key={m.id}
            id={m.id}
            className={`border-b border-border/50 scroll-mt-24 ${i % 2 === 1 ? "bg-background" : ""}`}
          >
            <div className="mx-auto max-w-5xl px-4 py-16 grid gap-10 md:grid-cols-3">
              <div className="md:col-span-1">
                <div className="h-16 w-16 rounded-sm bg-primary text-primary-foreground flex items-center justify-center mb-4">
                  <m.icon className="h-7 w-7" />
                </div>
                <EditableText id={`ministries.${m.id}.section.title`} defaultValue={m.title} as="h2" className="text-2xl md:text-3xl font-semibold tracking-tight block" />
                <EditableText id={`ministries.${m.id}.section.tagline`} defaultValue={m.tagline} as="p" multiline className="italic text-muted-foreground mt-3 block" />
                <dl className="mt-6 space-y-2 text-sm">
                  <div className="flex items-start gap-2"><Users className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span className="text-muted-foreground flex-1">Led by <EditableText id={`ministries.${m.id}.leader`} defaultValue={m.leader} className="text-foreground font-medium" /></span></div>
                  <div className="flex items-start gap-2"><Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" /><EditableText id={`ministries.${m.id}.meets`} defaultValue={m.meets} className="text-muted-foreground flex-1" /></div>
                  <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" /><EditableText id={`ministries.${m.id}.location`} defaultValue={m.location} className="text-muted-foreground flex-1" /></div>
                </dl>
              </div>
              <div className="md:col-span-2">
                <EditableText id={`ministries.${m.id}.description`} defaultValue={m.description} as="p" multiline className="text-foreground leading-relaxed mb-6 block" />
                <EditableText id={`ministries.${m.id}.activities.heading`} defaultValue="What we do" as="h4" className="text-lg font-semibold tracking-tight mb-3 block" />
                <ul className="space-y-2">
                  {m.activities.map((a, idx) => (
                    <li key={idx} className="flex gap-3 text-muted-foreground">
                      <span className="text-primary mt-1 shrink-0">&#9679;</span>
                      <EditableText id={`ministries.${m.id}.activity.${idx}`} defaultValue={a} multiline className="flex-1" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
