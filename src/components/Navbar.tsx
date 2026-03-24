import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Результаты", href: "#results" },
  { label: "Опыт", href: "#experience" },
  { label: "Портфолио", href: "#cases" },
  { label: "Навыки", href: "#skills" },
  { label: "Контакты", href: "#resume" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <a href="#" className="font-display text-lg text-foreground">
          А. Степанова
        </a>
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-background border-b border-border pb-4 px-6 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
