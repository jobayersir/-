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
export function getArabicFontFamily(fontName?: string): string {
  switch (fontName) {
    case 'Noto Naskh Arabic':
      return "'Noto Naskh Arabic', 'Amiri', 'Traditional Arabic', serif";
    case 'Amiri':
      return "'Amiri', 'Noto Naskh Arabic', 'Traditional Arabic', serif";
    case 'Scheherazade New':
      return "'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', serif";
    default:
      return "'Noto Naskh Arabic', 'Amiri', serif";
  }
}

/**
 * Maps selected Bengali font name to CSS font-family string
 */
export function getBengaliFontFamily(fontName?: string): string {
  switch (fontName) {
    case 'Hind Siliguri':
      return "'Hind Siliguri', 'Anek Bangla', 'Noto Serif Bengali', sans-serif";
    case 'Anek Bangla':
      return "'Anek Bangla', 'Hind Siliguri', sans-serif";
    case 'Noto Serif Bengali':
      return "'Noto Serif Bengali', 'Hind Siliguri', serif";
    default:
      return "'Hind Siliguri', 'Anek Bangla', 'Noto Serif Bengali', sans-serif";
  }
}
