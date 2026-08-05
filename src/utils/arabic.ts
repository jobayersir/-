// Utility functions for Arabic text formatting and Harakat stripping

/**
 * Removes Arabic Harakat / Tashkeel (diacritics: Fathatan, Dammatan, Kasratan, Fatha, Damma, Kasra, Shadda, Sukun, Superscript Alif, etc.)
 */
export function removeArabicHarakat(text: string): string {
  if (!text) return '';
  return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
}

/**
 * Formats text based on whether Harakat display is toggled on or off
 */
export function formatArabicText(text: string, showHarakat: boolean = true): string {
  if (!text) return '';
  if (showHarakat) return text;
  return removeArabicHarakat(text);
}

/**
 * Maps selected Arabic font name to CSS font-family string
 */
export function getArabicFontFamily(_fontName?: string): string {
  return "'Noto Naskh Arabic', 'Traditional Arabic', serif";
}

/**
 * Maps selected Bengali font name to CSS font-family string
 */
export function getBengaliFontFamily(_fontName?: string): string {
  return "'Noto Serif Bengali', 'SolaimanLipi', 'Kalpurush', serif";
}
