/**
 * AIESEC in Tunisia — Local Committees.
 *
 * AIESEC in Tunisia operates through 11 local committees (4 in Greater Tunis).
 * This list is the single source of truth for the "Choose your LC" dropdown.
 * ⚠️ Verify names/spelling against the current official roster before launch —
 * confirmed by name in research: Tunis, Bardo, Sfax, Hadrumet (Sousse).
 */
export const LOCAL_COMMITTEES = [
  "Tunis",
  "Carthage",
  "El Manar",
  "Bardo",
  "La Marsa",
  "Sfax",
  "Hadrumet (Sousse)",
  "Nabeul",
  "Bizerte",
  "Monastir",
  "Gabès",
] as const;

export type LocalCommittee = (typeof LOCAL_COMMITTEES)[number];
