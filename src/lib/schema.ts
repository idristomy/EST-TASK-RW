import { z } from "zod";
import { LOCAL_COMMITTEES } from "../data/localCommittees";

/**
 * Local Tunisian subscriber number — 8 digits only, since the +216 country code
 * is shown as a fixed prefix on the form and prepended again on submit. The
 * first digit is a real prefix (mobiles 2/4/5/9, landlines 3/7…); spaces, dots
 * and hyphens are allowed for readability. Examples: "20 123 456", "98765432".
 */
const TUNISIAN_PHONE = /^[2-9]\d{7}$/;

// Letters (incl. accents), spaces, apostrophes and hyphens — no digits/symbols.
const NAME_PATTERN = /^[\p{L}][\p{L}\s'’-]*$/u;

export const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(60, "That name looks too long.")
    .regex(NAME_PATTERN, "Use letters only — no numbers or symbols."),

  email: z
    .string()
    .trim()
    .min(1, "We need an email to reach you.")
    .email("That doesn’t look like a valid email."),

  phone: z
    .string()
    .trim()
    .min(1, "A phone number helps us follow up.")
    .refine(
      (value) => TUNISIAN_PHONE.test(value.replace(/[\s.-]/g, "")),
      "Enter your 8-digit Tunisian number (e.g. 20 123 456).",
    ),

  lc: z
    .string()
    .refine(
      (value) => (LOCAL_COMMITTEES as readonly string[]).includes(value),
      "Choose the Local Committee you’d like to join.",
    ),

  university: z
    .string()
    .trim()
    .min(2, "Tell us where you study.")
    .max(80, "That looks too long."),
});

export type ApplicationValues = z.infer<typeof applicationSchema>;

export const emptyApplication: ApplicationValues = {
  name: "",
  email: "",
  phone: "",
  lc: "",
  university: "",
};
