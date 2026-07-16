import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

export default function SuccessState({ onReset }: { onReset: () => void }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center px-6 py-14 text-center"
    >
      <motion.span
        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-jade/15 text-jade"
      >
        <Check className="h-8 w-8" strokeWidth={3} aria-hidden />
      </motion.span>

      <h3 className="mt-6 text-2xl font-black text-ink">You’re in the pipeline! 🎉</h3>
      <p className="mt-3 max-w-md text-slateink">
        Thanks for applying to AIESEC in Tunisia. Your Local Committee will reach out
        by email soon with the next steps. Welcome to the movement.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-8 rounded-full border border-hairline px-6 py-3 text-sm font-bold text-ink transition-colors duration-200 hover:border-aiesec hover:text-aiesec"
      >
        Submit another application
      </button>
    </motion.div>
  );
}
