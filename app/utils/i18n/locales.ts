export const SUPPORTED_LOCALES = [
  "en",
  "fr",
  "de",
  "es",
  "it",
  "ru",
  "ar",
  "zh-cn",
] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: LocaleCode = "en";

export function isSupportedLocale(value: string): value is LocaleCode {
  return SUPPORTED_LOCALES.includes(value as LocaleCode);
}

export function resolveLocale(value: string | null | undefined): LocaleCode {
  if (value && isSupportedLocale(value)) {
    return value;
  }
  return DEFAULT_LOCALE;
}
