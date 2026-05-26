import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { EditableImage, EditableText } from "@/components/Editable";
import { Mail, Phone } from "lucide-react";
import bible from "@/assets/bible.jpg";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Us — Newlands SDA Church" },
      { name: "description", content: "Learn about Newlands Seventh-day Adventist Church — our mission, beliefs, and the community we serve in Newlands, Johannesburg." },
    ],
  }),
});

/** Build a tiny SVG placeholder with the leader's initials so the slot is
 *  always image-shaped and can be replaced via EditableImage's file picker. */
function initialsPlaceholder(name: string): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#2a2a2a"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="system-ui, sans-serif" font-size="72" font-weight="600" fill="#888">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function About() {
  return (
    <PageShell>
      <PageHero title="About Our Church" subtitle="Faith, hope, and love at the heart of our community." image={bible} overlay={false} />
      <article className="mx-auto max-w-3xl px-4 py-16 prose prose-lg">
        <EditableText id="about.mission.heading" defaultValue="Our Mission" as="h2" className="text-3xl font-semibold tracking-tight text-foreground" />
        <EditableText
          id="about.mission.p1"
          defaultValue="As a Seventh-day Adventist church, our mission is to make disciples of Jesus Christ who live as His loving witnesses and proclaim to all people the everlasting gospel of the Three Angels' Messages in preparation for His soon return."
          as="p"
          multiline
          className="text-muted-foreground leading-relaxed mt-4"
        />
        <EditableText
          id="about.mission.p2"
          defaultValue="We strive to create a welcoming community where people can experience God's love, grow in their faith, and use their gifts in service to others. Through worship, fellowship, discipleship, ministry, and mission, we seek to fulfill Christ's commission to spread the gospel to all the world."
          as="p"
          multiline
          className="text-muted-foreground leading-relaxed mt-4"
        />
        <EditableText
          id="about.mission.p3"
          defaultValue="Our mission is centered on bringing health, hope, and healing to our community through Christ-centered ministries that address the spiritual, physical, mental, and social needs of people."
          as="p"
          multiline
          className="text-muted-foreground leading-relaxed mt-4"
        />

        <EditableText id="about.beliefs.heading" defaultValue="Our Beliefs" as="h2" className="text-3xl font-semibold tracking-tight text-foreground mt-12" />
        <EditableText
          id="about.beliefs.p1"
          defaultValue="We hold the Bible as our final authority and embrace the 28 Fundamental Beliefs of the Seventh-day Adventist Church — including the Sabbath as a day of rest and worship, the imminent return of Jesus Christ, and the call to wholistic living."
          as="p"
          multiline
          className="text-muted-foreground leading-relaxed mt-4"
        />

        <EditableText id="about.story.heading" defaultValue="Our Story" as="h2" className="text-3xl font-semibold tracking-tight text-foreground mt-12" />
        <EditableText
          id="about.story.p1"
          defaultValue="Newlands SDA was planted to bring a Christ-centered presence to the Newlands area of Johannesburg. From humble gatherings to a growing congregation, we are humbled by God's faithfulness and excited for what lies ahead."
          as="p"
          multiline
          className="text-muted-foreground leading-relaxed mt-4"
        />
      </article>

      {/* Leadership */}
      <section className="border-t border-border/50 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center mb-12">
            <EditableText id="about.leadership.eyebrow" defaultValue="Our Leadership" as="div" className="text-xs font-semibold uppercase tracking-wide text-primary mb-2" />
            <EditableText id="about.leadership.heading" defaultValue="Meet the Team" as="h2" className="text-3xl md:text-4xl font-semibold tracking-tight" />
            <EditableText
              id="about.leadership.subtitle"
              defaultValue="Serving our congregation with prayer, teaching, and pastoral care."
              as="p"
              multiline
              className="text-muted-foreground mt-3 max-w-xl mx-auto"
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {leaders.map((l, i) => {
              const key = `about.leader.${i}.${slug(l.name)}`;
              return (
                <article key={l.name} className="bg-card border border-border/50 rounded-md overflow-hidden shadow-sm flex flex-col sm:flex-row">
                  <div className="sm:w-56 shrink-0 bg-muted aspect-square sm:aspect-auto flex items-center justify-center overflow-hidden">
                    <EditableImage
                      id={`${key}.image`}
                      defaultSrc={l.image ?? initialsPlaceholder(l.name)}
                      alt={l.name}
                      className="h-full w-full object-cover"
                      wrapperClassName="block h-full w-full"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <EditableText id={`${key}.role`} defaultValue={l.role} as="div" className="text-[11px] font-semibold uppercase tracking-wide text-primary" />
                    <EditableText id={`${key}.name`} defaultValue={l.name} as="h3" className="text-xl font-semibold tracking-tight mt-1" />
                    <EditableText id={`${key}.bio`} defaultValue={l.bio} as="p" multiline className="text-sm text-muted-foreground leading-relaxed mt-3" />
                    <dl className="mt-5 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <Phone className="h-4 w-4 text-primary shrink-0" />
                        <EditableText id={`${key}.phone`} defaultValue={l.phone} as="span" className="hover:text-primary transition-colors" />
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <Mail className="h-4 w-4 text-primary shrink-0" />
                        <EditableText id={`${key}.email`} defaultValue={l.email} as="span" className="hover:text-primary transition-colors break-all" />
                      </div>
                    </dl>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const leaders: Array<{
  role: string;
  name: string;
  bio: string;
  phone: string;
  email: string;
  image?: string;
}> = [
  {
    role: "Pastor",
    name: "Jaco Van Niekerk",
    bio: "Shepherding our congregation through Christ-centered preaching and pastoral care. Committed to discipleship, family ministry, and equipping believers for service.",
    phone: "+27 83 216 3306",
    email: "pastor@newlandssda.org",
  },
  {
    role: "Head Elder",
    name: "Norman Molio",
    bio: "Supporting the pastor in spiritual leadership and coordinating church board ministries. Passionate about worship, prayer, and growing a Spirit-led community.",
    phone: "+27 72 437 9129",
    email: "headelder@newlandssda.org",
  },
];
