import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";

/** Applications close at the end of 20 July 2026 (local time). */
export const DEADLINE = new Date("2026-07-20T23:59:59");

type Remaining = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getRemaining(): Remaining {
  const total = DEADLINE.getTime() - Date.now();
  const c = Math.max(0, total);
  return {
    total,
    days: Math.floor(c / 86_400_000),
    hours: Math.floor((c / 3_600_000) % 24),
    minutes: Math.floor((c / 60_000) % 60),
    seconds: Math.floor((c / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Live countdown to the application deadline, styled for the dark hero. */
export default function Countdown() {
  const [t, setT] = useState<Remaining>(getRemaining);

  useEffect(() => {
    const id = window.setInterval(() => setT(getRemaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const closed = t.total <= 0;
  const units = [
    { value: t.days, label: "Days" },
    { value: t.hours, label: "Hours" },
    { value: t.minutes, label: "Min" },
    { value: t.seconds, label: "Sec" },
  ];

  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-semibold text-white/75">
        <CalendarClock className="h-4 w-4 text-golden" aria-hidden />
        {closed ? (
          <span>Applications are closed</span>
        ) : (
          <span>
            Applications close <span className="text-white">20 July 2026</span>
          </span>
        )}
      </p>

      {!closed && (
        <div className="mt-3 flex gap-2 sm:gap-2.5" role="timer" aria-live="off">
          {units.map((u) => (
            <div
              key={u.label}
              className="flex min-w-[3.75rem] flex-col items-center rounded-xl border border-white/15 bg-white/5 px-2.5 py-2 backdrop-blur-sm"
            >
              <span className="text-2xl font-black leading-none tabular-nums sm:text-3xl">
                {pad(u.value)}
              </span>
              <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white/55">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
