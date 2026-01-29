// Arabic NLP Optimization for Hekmo
// Handles Arabic-specific text processing, tokenization, and normalization

/**
 * Normalize Arabic text for better processing
 * - Removes diacritics (tashkeel)
 * - Normalizes alef variants
 * - Normalizes teh marbuta
 * - Removes tatweel (kashida)
 */
export function normalizeArabic(text: string): string {
  return (
    text
      // Remove diacritics (tashkeel)
      .replace(/[\u064B-\u0652]/g, "")
      // Normalize alef variants to bare alef
      .replace(/[إأآٱ]/g, "ا")
      // Normalize teh marbuta to heh
      .replace(/ة/g, "ه")
      // Remove tatweel
      .replace(/ـ/g, "")
      // Normalize alef maksura to yeh
      .replace(/ى/g, "ي")
      // Remove extra spaces
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Detect if text is primarily Arabic
 */
export function isArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const arabicChars = (text.match(arabicPattern) || []).length;
  const totalChars = text.replace(/\s/g, "").length;
  return arabicChars / totalChars > 0.5;
}

/**
 * Detect Saudi Arabic dialect markers
 */
export function isSaudiDialect(text: string): boolean {
  const saudiMarkers = [
    "وش",
    "ايش",
    "كذا",
    "زي",
    "مو",
    "عشان",
    "يعني",
    "حلو",
    "زين",
    "طيب",
    "ابد",
    "والله",
    "يالله",
    "كيف الحال",
    "شلون",
    "وين",
    "ليش",
    "متى",
  ];

  const normalizedText = normalizeArabic(text.toLowerCase());
  return saudiMarkers.some((marker) => normalizedText.includes(marker));
}

/**
 * Extract Arabic keywords from text
 */
export function extractArabicKeywords(text: string): string[] {
  const normalized = normalizeArabic(text);

  // Arabic stopwords to filter out
  const stopwords = new Set([
    "من",
    "الى",
    "على",
    "في",
    "عن",
    "مع",
    "هذا",
    "هذه",
    "ذلك",
    "تلك",
    "الذي",
    "التي",
    "هو",
    "هي",
    "نحن",
    "انت",
    "انتم",
    "هم",
    "هن",
    "كان",
    "كانت",
    "يكون",
    "تكون",
    "ان",
    "لا",
    "ما",
    "لم",
    "لن",
    "قد",
    "او",
    "و",
    "ف",
    "ب",
    "ك",
    "ل",
    "ال",
  ]);

  const words = normalized.split(/\s+/);

  return words
    .filter((word) => {
      const cleanWord = word.replace(/[^\u0600-\u06FF]/g, "");
      return cleanWord.length > 2 && !stopwords.has(cleanWord);
    })
    .slice(0, 10); // Limit to top 10 keywords
}

/**
 * Tokenize Arabic text properly
 */
export function tokenizeArabic(text: string): string[] {
  // Split on whitespace and punctuation while keeping Arabic text together
  return text
    .split(/[\s\u060C\u061B\u061F\u066A\u066B\u066C.,;:!?()[\]{}]+/)
    .filter((token) => token.length > 0);
}

/**
 * Clean Arabic text for display
 * - Fixes RTL/LTR issues
 * - Normalizes quotation marks
 * - Fixes common encoding issues
 */
export function cleanArabicText(text: string): string {
  return (
    text
      // Normalize quotation marks
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      // Fix common encoding issues
      .replace(/Ù…/g, "م")
      .replace(/Ø§/g, "ا")
      // Add proper RTL markers for mixed content
      .replace(/^/, "\u200F") // Add RTL mark at start
      .trim()
  );
}

// Import and re-export from format module to avoid duplication
import { toArabicNumerals as _toArabicNumerals } from "@/lib/utils/format";
export const toArabicNumerals = _toArabicNumerals;

/**
 * Format date in Arabic
 */
export function formatArabicDate(date: Date): string {
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${toArabicNumerals(day)} ${month} ${toArabicNumerals(year)}`;
}

/**
 * Get relative time in Arabic
 */
export function getRelativeTimeArabic(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${toArabicNumerals(diffMins)} دقيقة`;
  if (diffHours < 24) return `منذ ${toArabicNumerals(diffHours)} ساعة`;
  if (diffDays < 7) return `منذ ${toArabicNumerals(diffDays)} يوم`;
  if (diffDays < 30)
    return `منذ ${toArabicNumerals(Math.floor(diffDays / 7))} أسبوع`;

  return formatArabicDate(date);
}

/**
 * Detect business-related Arabic terms for Hekmo
 */
export function extractBusinessTerms(text: string): string[] {
  const businessTerms = [
    "سعر",
    "طلب",
    "حجز",
    "موعد",
    "عنوان",
    "موقع",
    "توصيل",
    "دفع",
    "فاتورة",
    "خصم",
    "عرض",
    "منتج",
    "خدمة",
    "شكوى",
    "استفسار",
    "مساعدة",
    "رد",
    "تأكيد",
    "إلغاء",
    "تعديل",
    "قائمة",
    "menu",
    "مطعم",
    "كافي",
    "صالون",
    "عيادة",
    "محل",
    "ساعات",
    "دوام",
    "مفتوح",
    "مغلق",
    "حساب",
    "تسجيل",
  ];

  const normalized = normalizeArabic(text.toLowerCase());
  return businessTerms.filter((term) => normalized.includes(term));
}

// Legacy alias for backward compatibility
export const extractHealthTerms = extractBusinessTerms;

/**
 * Enhance Arabic prompt for better AI understanding
 */
export function enhanceArabicPrompt(text: string): string {
  const isSaudi = isSaudiDialect(text);
  const businessTerms = extractBusinessTerms(text);

  let enhanced = text;

  // Add context hints for Saudi dialect
  if (isSaudi) {
    enhanced = `[Saudi Arabic dialect] ${enhanced}`;
  }

  // Add business context if relevant terms found
  if (businessTerms.length > 0) {
    enhanced = `[Business context: ${businessTerms.join(", ")}] ${enhanced}`;
  }

  return enhanced;
}
