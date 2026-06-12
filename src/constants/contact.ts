/** Tally contact form — set VITE_CONTACT_FORM_URL in .env / Netlify build env. */
export const CONTACT_FORM_URL = (
  import.meta.env.VITE_CONTACT_FORM_URL ?? "https://tally.so/r/Eka0LL"
).replace(/\/$/, "");
