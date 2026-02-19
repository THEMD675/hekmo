/**
 * Validation utilities for forms and inputs
 */

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Saudi phone number
 */
export function isValidSaudiPhone(phone: string): boolean {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, "");

  // Check for Saudi format
  // +966XXXXXXXXX, 00966XXXXXXXXX, 05XXXXXXXX, 5XXXXXXXX
  const patterns = [
    /^\+966[5][0-9]{8}$/, // +966XXXXXXXXX
    /^00966[5][0-9]{8}$/, // 00966XXXXXXXXX
    /^0[5][0-9]{8}$/, // 05XXXXXXXX
    /^[5][0-9]{8}$/, // 5XXXXXXXX
  ];

  return patterns.some((pattern) => pattern.test(cleaned));
}

/**
 * Validate Saudi National ID
 */
export function isValidNationalId(id: string): boolean {
  // Saudi National ID is 10 digits starting with 1 or 2
  const regex = /^[12][0-9]{9}$/;
  if (!regex.test(id)) {
    return false;
  }

  // Luhn algorithm validation
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    let digit = Number.parseInt(id[i], 10);
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }

  return sum % 10 === 0;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("يجب أن تكون 8 أحرف على الأقل");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("يجب أن تحتوي على حرف صغير");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("يجب أن تحتوي على حرف كبير");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("يجب أن تحتوي على رقم");
  }

  let strength: "weak" | "medium" | "strong" = "weak";
  if (errors.length === 0 && password.length >= 12) {
    strength = "strong";
  } else if (errors.length <= 1 && password.length >= 8) {
    strength = "medium";
  }

  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate message content
 */
export function validateMessage(content: string): {
  valid: boolean;
  error?: string;
} {
  if (!content.trim()) {
    return { valid: false, error: "الرسالة فارغة" };
  }

  if (content.length > 10_000) {
    return { valid: false, error: "الرسالة طويلة جداً" };
  }

  return { valid: true };
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, "");

  // Format as +966 XX XXX XXXX
  if (cleaned.startsWith("+966") || cleaned.startsWith("00966")) {
    const digits = cleaned.replace(/^\+966|^00966/, "");
    return `+966 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }

  // Format as 05X XXX XXXX
  if (cleaned.startsWith("0")) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  return phone;
}

/**
 * Mask sensitive data
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) {
    return email;
  }

  const maskedLocal =
    local.length > 2
      ? `${local[0]}${"*".repeat(local.length - 2)}${local.at(-1)}`
      : "*".repeat(local.length);

  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 4) {
    return phone;
  }

  return `${"*".repeat(cleaned.length - 4)}${cleaned.slice(-4)}`;
}
