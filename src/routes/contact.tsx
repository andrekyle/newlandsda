import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Newlands SDA Church" },
      { name: "description", content: "Get in touch with Newlands Seventh-day Adventist Church. Visit us at 116 Waterval Road, Newlands, Johannesburg." },
    ],
  }),
});

function Contact() {
  return (
    <PageShell>
      <PageHero title="Contact Us" subtitle="We'd love to hear from you. Come visit, call, or send a message." />
      <section className="mx-auto max-w-6xl px-4 py-16 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Get in Touch</h2>
          <ul className="space-y-5 text-sm">
            <li className="flex gap-3"><MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" /><div><div className="font-medium text-foreground">Address</div><div className="text-muted-foreground">116 Waterval Road, Newlands<br />Johannesburg, South Africa</div></div></li>
            <li className="flex gap-3"><Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" /><div><div className="font-medium text-foreground">Phone</div><div className="text-muted-foreground">+27 11 000 0000</div></div></li>
            <li className="flex gap-3"><Mail className="h-5 w-5 text-primary mt-0.5 shrink-1" /><div><div className="font-medium text-foreground">Email</div><div className="text-muted-foreground">info@newlandssda.org</div></div></li>
            <li className="flex gap-3"><Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" /><div><div className="font-medium text-foreground">Service Times</div><div className="text-muted-foreground">Sabbath School: Saturday 9:00 AM<br />Divine Worship: Saturday 11:00 AM<br />Prayer Meeting: Wednesday 18:30</div></div></li>
          </ul>
        </div>
        <form className="bg-card border border-border/50 p-8 rounded-sm space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thank you! We'll be in touch."); }}>
          <h2 className="text-2xl font-semibold tracking-tight">Send a Message</h2>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">Name</label>
            <input required className="w-full border border-border/50 bg-background px-3.5 py-2.5 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">Email</label>
            <input required type="email" className="w-full border border-border/50 bg-background px-3.5 py-2.5 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">Message</label>
            <textarea required rows={5} className="w-full border border-border/50 bg-background px-3.5 py-2.5 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <button type="submit" className="bg-primary text-primary-foreground px-6 py-3 font-medium rounded-none text-sm hover:opacity-90 transition-opacity">
            Send Message
          </button>
        </form>
      </section>
    </PageShell>
  );
}
