import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { EditableText, EditableImage } from "@/components/Editable";
import { Calendar, BookOpen, Users, Heart, ArrowRight, MapPin, Clock, Sun, Moon } from "lucide-react";
import congregation from "@/assets/congregation.jpg";
import church from "@/assets/church.jpg";
import children from "@/assets/children.jpg";
import heroImage from "@/assets/hero.jpg";
import heroMobileImage from "@/assets/heroMobile.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Newlands SDA — Seventh-day Adventist Church in Newlands" },
      { name: "description", content: "Welcome to Newlands Seventh-day Adventist Church. Join our community for worship, fellowship, and service every Sabbath in Newlands, Johannesburg." },
    ],
  }),
});

function Home() {
  const [mapLight, setMapLight] = useState(false);
  return (
    <PageShell>
      {/* Hero — full-bleed image; header overlays the top.
          Mobile gets a dedicated portrait-friendly variant. */}
      <section className="relative overflow-hidden bg-black">
        <EditableImage
          id="home.hero.image.mobile"
          defaultSrc={heroMobileImage}
          alt="A lighthouse beneath a starry sky — Thy word is a lamp unto my feet, and a light unto my path. Psalm 119:105"
          className="block sm:hidden w-full h-auto -mt-16"
          wrapperClassName="block sm:hidden w-full"
          fetchPriority="high"
        />
        <EditableImage
          id="home.hero.image"
          defaultSrc={heroImage}
          alt="A lighthouse beneath a starry sky — Thy word is a lamp unto my feet, and a light unto my path. Psalm 119:105"
          className="hidden sm:block w-full h-auto sm:-mt-[100px]"
          wrapperClassName="hidden sm:block w-full"
          fetchPriority="high"
        />
        <div className="flex justify-center pb-8 pt-4 sm:pb-12 sm:pt-6">
          <Link
            to="/ministries"
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
          >
            Our Ministries
          </Link>
        </div>
      </section>

      {/* Welcome + quick info */}
      <section className="relative overflow-hidden bg-background">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
              Welcome to{" "}
              <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Newlands SDA
              </span>{" "}
              <br className="sm:hidden" />
              Church
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              <EditableText
                id="home.welcome.intro"
                defaultValue="A welcoming community where faith, hope, and love guide us in worship, fellowship, and service every Sabbath."
                multiline
              />
            </p>

            {/* Quick info pills */}
            <dl className="mt-14 grid w-full max-w-3xl grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 rounded-sm border border-border/60 bg-card/60 backdrop-blur px-4 py-3 text-left">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <EditableText id="home.info.sabbathSchool.label" defaultValue="Sabbath School" />
                  </dt>
                  <dd className="text-sm font-medium">
                    <EditableText id="home.info.sabbathSchool.value" defaultValue="Saturdays · 9:00 AM" />
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-sm border border-border/60 bg-card/60 backdrop-blur px-4 py-3 text-left">
                <BookOpen className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <EditableText id="home.info.divineWorship.label" defaultValue="Divine Worship" />
                  </dt>
                  <dd className="text-sm font-medium">
                    <EditableText id="home.info.divineWorship.value" defaultValue="Saturdays · 11:00 AM" />
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-sm border border-border/60 bg-card/60 backdrop-blur px-4 py-3 text-left">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <EditableText id="home.info.location.label" defaultValue="Location" />
                  </dt>
                  <dd className="text-sm font-medium">
                    <EditableText id="home.info.location.value" defaultValue="116 Waterval Road" />
                  </dd>
                </div>
              </div>
            </dl>

            {/* Google Map — dark by default, click to switch to light */}
            <div className="mt-8 w-full max-w-3xl">
              <div className="relative overflow-hidden border border-border/60 bg-card/60 shadow-sm">
                <iframe
                  title="Newlands SDA Church location map"
                  src="https://www.google.com/maps?q=116+Waterval+Road,+Newlands,+Johannesburg&output=embed"
                  width="100%"
                  height="320"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block w-full border-0 transition-[filter] duration-300"
                  style={{ filter: mapLight ? "none" : "invert(0.92) hue-rotate(180deg) saturate(0.85) brightness(0.95)" }}
                  allowFullScreen
                />
                {!mapLight && (
                  <button
                    type="button"
                    onClick={() => setMapLight(true)}
                    aria-label="Switch map to light mode"
                    className="absolute top-2 right-2 z-10 p-2 rounded-none text-foreground/70 hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm"
                  >
                    <Sun className="h-4 w-4" />
                  </button>
                )}
                {mapLight && (
                  <button
                    type="button"
                    onClick={() => setMapLight(false)}
                    aria-label="Switch map to dark mode"
                    className="absolute top-2 right-2 z-10 p-2 rounded-none text-foreground/70 hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm"
                  >
                    <Moon className="h-4 w-4" />
                  </button>
                )}
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=116+Waterval+Road,+Newlands,+Johannesburg"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              >
                <MapPin className="h-4 w-4" /> Get directions <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Verse banner */}
      <section className="relative overflow-hidden bg-[#1e3a8a] text-white">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(255,255,255,0.12), transparent 60%)" }} />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="font-serif italic text-2xl md:text-4xl leading-[1.3] text-white">
            &ldquo;For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.&rdquo;
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-white/50" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/80">John 3 &middot; 16</span>
            <span className="h-px w-12 bg-white/50" />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-6xl px-4 py-20 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">About Us</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">A Place to Belong, Believe, and Become</h2>
          <p className="text-muted-foreground leading-relaxed mt-6 mb-4">
            As a Seventh-day Adventist church, our mission is to make disciples of Jesus Christ who live as His loving witnesses and proclaim to all people the everlasting gospel of the Three Angels' Messages in preparation for His soon return.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We strive to create a welcoming community where people can experience God's love, grow in their faith, and use their gifts in service to others.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-opacity">
            Read More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <img src={congregation} alt="Newlands SDA congregation worshipping" width={1280} height={832} loading="lazy" decoding="async" className="rounded-sm shadow-sm" />
      </section>

      {/* Featured event */}
      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20 grid gap-10 md:grid-cols-2 items-center">
          <img src={church} alt="Newlands SDA church" width={1280} height={832} loading="lazy" decoding="async" className="rounded-sm shadow-sm order-2 md:order-1" />
          <div className="order-1 md:order-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Featured Event</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Newlands Church Opening</h2>
            <p className="text-muted-foreground leading-relaxed mt-6 mb-6">
              We are overjoyed to invite the community to the grand opening of Newlands Seventh-day Adventist Church — a milestone celebrating God's faithfulness to our growing congregation.
            </p>
            <ul className="space-y-2 text-sm text-foreground mb-6">
              <li className="flex gap-2"><Calendar className="h-4 w-4 text-primary mt-0.5" /> Saturday, 28 March 2026 · 09:00</li>
              <li className="flex gap-2"><Users className="h-4 w-4 text-primary mt-0.5" /> 116 Waterval Road, Newlands</li>
            </ul>
            <Link to="/events" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 font-medium rounded-none text-sm hover:opacity-90 transition-opacity">
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ministries grid */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">What We Do</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Our Ministries</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: BookOpen, title: "Sabbath School", desc: "Bible study classes for all ages every Sabbath morning." },
            { icon: Users, title: "Community Outreach", desc: "Serving our neighbours through health, hope, and healing." },
            { icon: Heart, title: "Children & Youth", desc: "Nurturing young hearts to know and love Jesus." },
          ].map((m) => (
            <div key={m.title} className="bg-card border border-border/50 p-8 rounded-sm hover:border-primary/50 transition-colors">
              <m.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold tracking-tight mb-2">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service times CTA */}
      <section className="relative overflow-hidden rounded-sm mx-4 max-w-6xl md:mx-auto mb-20">
        <EditableImage id="home.cta.image" defaultSrc={children} alt="" width={1280} height={832} loading="lazy" className="absolute inset-0 h-full w-full object-cover" wrapperClassName="absolute inset-0" />
        <div className="absolute inset-0 bg-black/60 rounded-sm" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Join Us This Sabbath</h2>
          <p className="mt-4 text-white/80">Sabbath School at 9:00 AM · Divine Worship at 11:00 AM</p>
          <Link to="/contact" className="inline-flex mt-8 items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-medium rounded-none text-sm hover:opacity-90 transition-opacity">
            Plan Your Visit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
