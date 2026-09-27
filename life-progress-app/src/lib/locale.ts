/**
 * The app's supported languages. Adding a new one later means adding it
 * here, giving it an entry in i18n.ts's dictionaries, and nothing else —
 * every component reads strings through t(), never a hardcoded language.
 */
export type Locale = "en" | "ru" | "uk" | "es";

export const SUPPORTED_LOCALES: Locale[] = ["en", "ru", "uk", "es"];

/** BCP-47 tags for Intl.DateTimeFormat (month names, weekday names, ...). */
export const LOCALE_TAG: Record<Locale, string> = {
  en: "en-US",
  ru: "ru-RU",
  uk: "uk-UA",
  es: "es-ES",
};

/** Each language's own name for itself — never translated (a Russian
 * speaker looking for their language in a list of English labels would
 * have to first read the English word for "Russian"; showing "Русский"
 * instead means every option is legible to the person it's for). */
export const LOCALE_NATIVE_NAME: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  uk: "Українська",
  es: "Español",
};

/**
 * Maps a raw IETF language tag — Telegram's `language_code` ("ru",
 * "pt-BR", ...), or whatever a browser/localStorage hands back — to one of
 * our supported locales. Anything we don't have translations for yet (or a
 * missing/malformed value) falls back to English rather than guessing.
 */
export function normalizeLocale(code: string | null | undefined): Locale {
  if (!code) return "en";
  const base = code.toLowerCase().split("-")[0];
  if (base === "ru" || base === "uk" || base === "es") return base;
  return "en";
}
