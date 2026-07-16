import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-hairline bg-white/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-baseline gap-2" aria-label="AIESEC in Tunisia — home">
          <span
            className={`text-xl font-black tracking-tight ${
              scrolled ? "text-aiesec" : "text-white"
            }`}
          >
            AIESEC
          </span>
          <span
            className={`hidden text-sm font-semibold sm:inline ${
              scrolled ? "text-slateink" : "text-white/70"
            }`}
          >
            in Tunisia
          </span>
        </a>

        <a
          href="#apply"
          className="group inline-flex items-center gap-2 rounded-full bg-aiesec px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-transform duration-200 hover:-translate-y-0.5 hover:bg-aiesec-700"
        >
          Apply now
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </a>
      </div>
    </header>
  );
}
