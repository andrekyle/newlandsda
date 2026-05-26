import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { EditableImage, EditableText } from "./Editable";
import { useAdmin, useOverride } from "@/lib/admin";
import sdaLogo from "@/assets/sda-logo.svg";

function EditableSocialLink({
  id,
  defaultHref,
  label,
  children,
}: {
  id: string;
  defaultHref: string;
  label: string;
  children: React.ReactNode;
}) {
  const { editMode } = useAdmin();
  const [href, setHref] = useOverride<string>(id, defaultHref);
  if (!editMode) {
    return (
      <a
        href={href || "#"}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={label}
        className="p-2.5 rounded-sm bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-muted-foreground"
      >
        {children}
      </a>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <span className="p-2.5 rounded-sm bg-muted text-muted-foreground" aria-label={label}>
        {children}
      </span>
      <input
        type="url"
        value={href}
        onChange={(e) => setHref(e.target.value)}
        placeholder={`${label} URL`}
        className="w-44 text-xs bg-black/90 text-white/95 border border-white/15 hover:border-white/25 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 rounded-none px-2 py-1"
      />
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card mt-20">
      <div className="mx-auto max-w-6xl px-4 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <EditableImage id="brand.logo" defaultSrc={sdaLogo} alt="" width={48} height={48} className="h-12 w-12" />
            <EditableText id="footer.brand.name" defaultValue="Newlands SDA" as="h3" className="text-2xl font-semibold tracking-tight" />
          </div>
          <EditableText
            id="footer.brand.tagline"
            defaultValue="A welcoming community where faith, hope, and love guide us in service to God and others."
            as="p"
            multiline
            className="text-sm text-muted-foreground leading-relaxed"
          />
        </div>
        <div>
          <EditableText id="footer.quicklinks.heading" defaultValue="Quick Links" as="h4" className="text-sm font-semibold tracking-tight mb-3 text-foreground" />
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground transition-colors"><EditableText id="footer.quicklinks.about" defaultValue="About Us" /></Link></li>
            <li><Link to="/ministries" className="hover:text-foreground transition-colors"><EditableText id="footer.quicklinks.ministries" defaultValue="Ministries" /></Link></li>
            <li><Link to="/events" className="hover:text-foreground transition-colors"><EditableText id="footer.quicklinks.events" defaultValue="Events" /></Link></li>
            <li><Link to="/sermons" className="hover:text-foreground transition-colors"><EditableText id="footer.quicklinks.sermons" defaultValue="Sermons" /></Link></li>
          </ul>
        </div>
        <div>
          <EditableText id="footer.contact.heading" defaultValue="Contact" as="h4" className="text-sm font-semibold tracking-tight mb-3 text-foreground" />
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex gap-2.5"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" /><EditableText id="footer.contact.address" defaultValue="116 Waterval Road, Newlands, Johannesburg" multiline /></li>
            <li className="flex gap-2.5"><Phone className="h-4 w-4 mt-1 shrink-0 text-primary" /><EditableText id="footer.contact.phone" defaultValue="+27 83 216 3306" /></li>
            <li className="flex gap-2.5"><Mail className="h-4 w-4 mt-1 shrink-0 text-primary" /><EditableText id="footer.contact.email" defaultValue="info@newlandssda.org" /></li>
          </ul>
        </div>
        <div>
          <EditableText id="footer.follow.heading" defaultValue="Follow Us" as="h4" className="text-sm font-semibold tracking-tight mb-3 text-foreground" />
          <div className="flex flex-wrap items-center gap-2">
            <EditableSocialLink id="footer.social.facebook" defaultHref="#" label="Facebook">
              <Facebook className="h-4 w-4" />
            </EditableSocialLink>
            <EditableSocialLink id="footer.social.youtube" defaultHref="#" label="YouTube">
              <Youtube className="h-4 w-4" />
            </EditableSocialLink>
          </div>
          <EditableText
            id="footer.follow.times"
            defaultValue={"Sabbath School: 9:00 AM\nDivine Worship: 11:00 AM"}
            as="p"
            multiline
            className="text-xs text-muted-foreground mt-4 whitespace-pre-line"
          />
        </div>
      </div>
      <div className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
          <EditableText
            id="footer.legal.copyright"
            defaultValue={`© ${new Date().getFullYear()} Newlands Seventh-day Adventist Church. All rights reserved.`}
            as="span"
          />
          <EditableText id="footer.legal.tagline" defaultValue="Proudly serving our community" as="span" />
        </div>
      </div>
    </footer>
  );
}
