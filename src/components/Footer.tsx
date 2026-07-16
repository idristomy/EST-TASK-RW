import { Instagram, Facebook, Linkedin } from "lucide-react";

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/aiesecintunisia/" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/AIESEC.Tunisia/" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/aiesec-tunisia" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black tracking-tight text-white">AIESEC</span>
            <span className="text-sm font-semibold text-white/60">in Tunisia</span>
          </div>

          <div className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
              >
                <s.icon className="h-5 w-5" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-white/50">
          © {new Date().getFullYear()} AIESEC in Tunisia. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
