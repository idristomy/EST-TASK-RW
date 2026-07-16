import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

type CountUpProps = {
  /** The final, already-formatted value, e.g. "1,200+", "120+", "1962". */
  value: string;
  /** Where the count begins (0 for tallies, e.g. 2026 for a year counting back). */
  from?: number;
  /** Gate: the count only runs once this is true (used to wait for the intro). */
  start?: boolean;
  /** Seconds to wait before counting starts. */
  delay?: number;
  /** Count duration in seconds. */
  duration?: number;
};

/**
 * Parses a display value into its numeric target and the formatting to keep:
 * a trailing "+" and comma grouping are inferred from the source string so the
 * animated output matches the design (e.g. "1,200+" counts up to 1,200 then "+").
 */
function parse(value: string) {
  const target = Number(value.replace(/[^\d]/g, ""));
  return {
    target,
    suffix: value.includes("+") ? "+" : "",
    grouped: value.includes(","),
  };
}

const format = (n: number, grouped: boolean) => {
  const rounded = Math.round(n);
  return grouped ? rounded.toLocaleString("en-US") : String(rounded);
};

/** Counts a stat from `from` to its target once `start` is true; honours reduced motion. */
export default function CountUp({
  value,
  from = 0,
  start = true,
  delay = 0,
  duration = 2,
}: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const { target, suffix, grouped } = parse(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduce) {
      node.textContent = format(target, grouped) + suffix;
      return;
    }

    // Hold at the starting value until the page is revealed, then count.
    if (!start) {
      node.textContent = format(from, grouped) + suffix;
      return;
    }

    const controls = animate(from, target, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest, grouped) + suffix;
      },
    });
    return () => controls.stop();
  }, [target, suffix, grouped, from, start, delay, duration, reduce]);

  // First paint sits at the starting value so the number is never seen jumping
  // from its final value; reduced-motion users get the final value straight away.
  return (
    <span ref={ref}>
      {reduce ? format(target, grouped) + suffix : format(from, grouped) + suffix}
    </span>
  );
}
