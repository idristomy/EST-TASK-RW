import { motion, useReducedMotion } from "framer-motion";
import Logo from "./Logo";
import Countdown from "./Countdown";
import CountUp from "./CountUp";
import RecruitmentForm from "./RecruitmentForm";

const STATS = [
  { value: "1962", from: 2026, label: "In Tunisia since" },
  { value: "120+", from: 0, label: "Countries" },
  { value: "11", from: 0, label: "Local Committees" },
  { value: "1,200+", from: 0, label: "Members" },
] as const;

export default function Hero({ revealed = false }: { revealed?: boolean }) {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Full-bleed conference / leadership photograph */}
      <img
        src="/hero-conference.jpg"
        alt="Young leaders at an AIESEC conference"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        loading="eager"
      />
      {/* Brand overlay keeps the left copy legible over any photo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/60"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-aiesec/25 to-transparent mix-blend-screen"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-14 pt-28 sm:px-8 lg:min-h-screen lg:grid-cols-[1fr_minmax(400px,460px)] lg:gap-14 lg:pb-16 lg:pt-24">
        {/* Copy column */}
        <div className="text-white">
          <motion.div {...rise(0)}>
            <Logo tone="blue" className="h-10" />
          </motion.div>

          <motion.p
            {...rise(0.08)}
            className="eyebrow mt-8 text-white/70"
          >
            AIESEC in Tunisia Recruitment
          </motion.p>

          <motion.h1
            {...rise(0.16)}
            className="mt-4 text-balance text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Lead the change.
            <br />
            Start with <span className="text-golden">AIESEC.</span>
          </motion.h1>

          <motion.p
            {...rise(0.24)}
            className="mt-6 max-w-lg text-lg leading-relaxed text-white/80"
          >
            The world’s largest youth-led organisation — developing leadership through
            global exchange and real community impact. Your journey starts here.
          </motion.p>

          <motion.div {...rise(0.32)} className="mt-8">
            <Countdown />
          </motion.div>

          <motion.dl
            {...rise(0.4)}
            className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-6"
          >
            {STATS.map((stat, i) => (
              <div key={stat.label}>
                <dt className="text-2xl font-black leading-none tabular-nums sm:text-3xl">
                  <CountUp
                    value={stat.value}
                    from={stat.from}
                    start={revealed}
                    delay={i * 0.12}
                  />
                </dt>
                <dd className="mt-1.5 text-[0.68rem] font-semibold uppercase tracking-wider text-white/55">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Form column */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <RecruitmentForm />
        </motion.div>
      </div>
    </section>
  );
}
