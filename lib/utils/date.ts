/**
 * Date utilities with Arabic localization
 */

const ARABIC_MONTHS = [
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

const ARABIC_DAYS = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

const _HIJRI_MONTHS = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الثاني",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

/**
 * Format date in Arabic
 */
export function formatDateArabic(date: Date): string {
  const day = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format date with day name
 */
export function formatDateWithDay(date: Date): string {
  const dayName = ARABIC_DAYS[date.getDay()];
  const day = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth()];
  return `${dayName}، ${day} ${month}`;
}

/**
 * Format time in Arabic (12-hour format)
 */
export function formatTimeArabic(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "م" : "ص";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

/**
 * Get relative time in Arabic
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return "الآن";
  }
  if (diffMinutes < 60) {
    return `منذ ${diffMinutes} دقيقة`;
  }
  if (diffHours < 24) {
    return `منذ ${diffHours} ساعة`;
  }
  if (diffDays === 1) {
    return "أمس";
  }
  if (diffDays < 7) {
    return `منذ ${diffDays} أيام`;
  }
  if (diffWeeks < 4) {
    return `منذ ${diffWeeks} أسابيع`;
  }
  if (diffMonths < 12) {
    return `منذ ${diffMonths} أشهر`;
  }
  return `منذ ${diffYears} سنة`;
}

/**
 * Format duration in Arabic
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours} ساعة ${minutes} دقيقة`;
  }
  if (minutes > 0) {
    return `${minutes} دقيقة ${secs} ثانية`;
  }
  return `${secs} ثانية`;
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Format chat date for sidebar
 */
export function formatChatDate(date: Date): string {
  if (isToday(date)) {
    return "اليوم";
  }
  if (isYesterday(date)) {
    return "أمس";
  }

  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 7) {
    return formatDateWithDay(date);
  }
  return formatDateArabic(date);
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 6) {
    return "مرحباً";
  }
  if (hour < 12) {
    return "صباح الخير";
  }
  if (hour < 17) {
    return "مساء الخير";
  }
  if (hour < 21) {
    return "مساء الخير";
  }
  return "مرحباً";
}

/**
 * Parse date from various formats
 */
export function parseDate(input: string): Date | null {
  // Try standard formats
  const date = new Date(input);
  if (!Number.isNaN(date.getTime())) {
    return date;
  }

  // Try Arabic format (e.g., "١٥ يناير ٢٠٢٤")
  // Add more parsing logic as needed

  return null;
}
