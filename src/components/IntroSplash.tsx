import { useEffect, useRef, useState } from "react";

type Phase = "show" | "fade" | "done";

/**
 * Opening splash: a walking-figure animation over a full-screen AIESEC-blue
 * background that plays once, then fades away to reveal the site. Clicking skips
 * it, and a safety timer guarantees it never blocks the page (e.g. if autoplay
 * is denied). Scroll is locked while it's on screen.
 */
export default function IntroSplash({ onReveal }: { onReveal?: () => void }) {
  const [phase, setPhase] = useState<Phase>("show");
  const videoRef = useRef<HTMLVideoElement>(null);

  const beginFade = () => setPhase((p) => (p === "show" ? "fade" : p));

  // Tell the page it's being revealed the moment the fade starts, so hero
  // animations run in view instead of finishing behind the splash.
  useEffect(() => {
    if (phase === "fade") onReveal?.();
  }, [phase, onReveal]);

  // Guarantee muted autoplay (React can drop the `muted` attribute).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      /* autoplay blocked — the safety timer below will dismiss the splash */
    });
  }, []);

  // Lock page scroll while the splash is visible.
  useEffect(() => {
    document.body.style.overflow = phase === "done" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  // Never leave the splash up longer than ~3.5s.
  useEffect(() => {
    const safety = window.setTimeout(beginFade, 3500);
    return () => window.clearTimeout(safety);
  }, []);

  // Unmount once the fade transition finishes.
  useEffect(() => {
    if (phase !== "fade") return;
    const t = window.setTimeout(() => setPhase("done"), 700);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      role="presentation"
      onClick={beginFade}
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-aiesec transition-opacity duration-700 ${
        phase === "fade" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        autoPlay
        muted
        playsInline
        onEnded={beginFade}
        aria-hidden
      >
        <source src="/intro-walk.webm" type="video/webm" />
        <source src="/intro-walk.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
