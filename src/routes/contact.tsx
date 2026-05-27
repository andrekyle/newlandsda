import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { EditableText } from "@/components/Editable";
import contactBanner from "@/assets/contact.png";

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
      <PageHero title="Contact Us" subtitle="We'd love to hear from you. Come visit, call, or send a message." image={contactBanner} overlay={false} />
      <section className="mx-auto max-w-6xl px-4 py-16 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            <EditableText id="contact.heading" defaultValue="Get in Touch" />
          </h2>
          <ul className="space-y-5 text-sm">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground">
                  <EditableText id="contact.address.label" defaultValue="Address" />
                </div>
                <EditableText
                  id="contact.address.value"
                  defaultValue={"116 Waterval Road, Newlands\nJohannesburg, South Africa"}
                  as="div"
                  multiline
                  className="text-muted-foreground whitespace-pre-line"
                />
              </div>
            </li>
            <li className="flex gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground">
                  <EditableText id="contact.phone.label" defaultValue="Phone" />
                </div>
                <EditableText
                  id="contact.phone.value"
                  defaultValue="+27 11 000 0000"
                  as="div"
                  className="text-muted-foreground"
                />
              </div>
            </li>
            <li className="flex gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground">
                  <EditableText id="contact.email.label" defaultValue="Email" />
                </div>
                <EditableText
                  id="contact.email.value"
                  defaultValue="info@newlandssda.org"
                  as="div"
                  className="text-muted-foreground"
                />
              </div>
            </li>
            <li className="flex gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground">
                  <EditableText id="contact.services.label" defaultValue="Service Times" />
                </div>
                <EditableText
                  id="contact.services.value"
                  defaultValue={"Sabbath School: Saturday 9:00 AM\nDivine Worship: Saturday 11:00 AM\nPrayer Meeting: Wednesday 18:30"}
                  as="div"
                  multiline
                  className="text-muted-foreground whitespace-pre-line"
                />
              </div>
            </li>
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
