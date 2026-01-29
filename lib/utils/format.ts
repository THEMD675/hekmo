/**
 * Formatting utilities
 */

/**
 * Format number with Arabic numerals
 */
export function toArabicNumerals(num: number | string): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .replace(/[0-9]/g, (d) => arabicNumerals[Number.parseInt(d, 10)]);
}

/**
 * Format number with commas (Arabic style)
 */
export function formatNumber(num: number, useArabic = false): string {
  const formatted = num.toLocaleString("ar-SA");
  return useArabic ? toArabicNumerals(formatted) : formatted;
}

/**
 * Format currency (SAR)
 */
export function formatCurrency(
  amount: number,
  options: { symbol?: boolean; decimals?: number } = {}
): string {
  const { symbol = true, decimals = 2 } = options;
  const formatted = amount
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return symbol ? `${formatted} ر.س` : formatted;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 بايت";

  const units = ["بايت", "كيلوبايت", "ميجابايت", "جيجابايت"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const size = Number.parseFloat((bytes / k ** i).toFixed(1));
  return `${size} ${units[i]}`;
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  total: number,
  decimals = 0
): string {
  if (total === 0) return "0%";
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Capitalize first letter (works with Arabic)
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format count with Arabic plural rules
 */
export function formatCount(
  count: number,
  singular: string,
  dual: string,
  plural: string
): string {
  if (count === 0) return `لا ${plural}`;
  if (count === 1) return `${singular} واحد`;
  if (count === 2) return `${dual}`;
  if (count >= 3 && count <= 10) return `${count} ${plural}`;
  return `${count} ${singular}`;
}

/**
 * Format message count
 */
export function formatMessageCount(count: number): string {
  return formatCount(count, "رسالة", "رسالتان", "رسائل");
}

/**
 * Format chat count
 */
export function formatChatCount(count: number): string {
  return formatCount(count, "محادثة", "محادثتان", "محادثات");
}

/**
 * Slugify text (for URLs)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u0621-\u064A-]/g, "")
    .replace(/-+/g, "-");
}

/**
 * Extract initials from name
 */
export function getInitials(name: string): string {
  if (!name) return "?";

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Generate random color for avatar
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#14b8a6", // teal
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
  ];

  // Simple hash from name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
