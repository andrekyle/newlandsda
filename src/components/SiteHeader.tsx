import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { AdminToggle } from "./AdminToggle";
import { EditableImage } from "./Editable";
import sdaLogo from "@/assets/sda-logo.svg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/ministries", label: "Ministries" },
  { to: "/events", label: "Events" },
  { to: "/bulletin", label: "Bulletin" },
  { to: "/sermons", label: "Sermons" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHero = pathname === "/";
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const opacity = onHero ? Math.max(0, 1 - scrollY / 200) : 1;
  const hidden = opacity <= 0.01;

  // Style sets depending on whether the header is overlaying the dark hero
  const brandText = onHero ? "text-white drop-shadow" : "text-foreground";
  const navLinkBase = onHero
    ? "px-3 py-1.5 text-sm font-normal text-white/80 hover:text-white drop-shadow transition-colors rounded-none"
    : "px-3 py-1.5 text-sm font-normal text-foreground hover:text-foreground transition-colors rounded-none";
  const navLinkActive = onHero
    ? "px-3 py-1.5 text-sm font-normal text-white bg-white/5 drop-shadow rounded-none"
    : "px-3 py-1.5 text-sm font-normal text-foreground bg-foreground/[0.03] rounded-none";
  const iconBtn = onHero
    ? "p-2 rounded-none text-white/80 hover:text-white hover:bg-white/10 transition-colors"
    : "p-2 rounded-none text-foreground hover:text-foreground hover:bg-foreground/5 transition-colors";
  const menuBtn = onHero
    ? "md:hidden p-2 rounded-none text-white hover:bg-white/10"
    : "md:hidden p-2 rounded-none text-foreground hover:bg-muted";
  const headerPositional = onHero
    ? "absolute inset-x-0 top-0 z-50 bg-transparent"
    : "relative z-50 bg-transparent";

  return (
    <header
      style={onHero ? { opacity } : undefined}
      className={`${headerPositional} ${hidden ? "pointer-events-none" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <EditableImage id="brand.logo" defaultSrc={sdaLogo} alt="Newlands SDA" width={48} height={48} className="h-12 w-12" />
          <span className={`text-2xl font-semibold tracking-tight ${brandText}`}>
            Newlands SDA
          </span>
        </Link>
        <button className={menuBtn} onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={navLinkBase}
              activeProps={{ className: navLinkActive }}
            >
              {n.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-1">
            <button className={iconBtn} aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
            <ThemeToggle className={iconBtn} />
            <AdminToggle className={iconBtn} />
          </div>
        </nav>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-0.5">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2.5 px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-none transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
