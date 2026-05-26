import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // Keep the toggle effectively transparent in every state — it must never
  // become a bright pill on the dark hero photo. Tailwind v4 uses the
  // trailing-`!` important syntax to override any inherited hover bg.
  const base =
    "p-2 rounded-none transition-colors bg-transparent! hover:bg-transparent! focus:bg-transparent! focus-visible:bg-transparent! active:bg-transparent!";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`${className ?? ""} ${base}`}
      style={{
        backgroundColor: "transparent",
        color: "rgba(0, 0, 0, 0.92)",
      }}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
