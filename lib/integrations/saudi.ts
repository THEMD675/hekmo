// Saudi Arabia Specific Integrations for Hekmo
// Absher, SADAD, and Nafath

// =============================================================================
// ABSHER INTEGRATION (Government Services)
// =============================================================================

const ABSHER_API_URL = process.env.ABSHER_API_URL;
const ABSHER_API_KEY = process.env.ABSHER_API_KEY;

interface AbsherUser {
  nationalId: string;
  name: string;
  nameAr: string;
  dateOfBirth: string;
  mobileNumber: string;
}

// Verify user with Absher (placeholder)
export async function verifyAbsherUser(
  nationalId: string,
  mobileNumber: string
): Promise<{ verified: boolean; user?: AbsherUser }> {
  if (!ABSHER_API_URL || !ABSHER_API_KEY) {
    console.warn("Absher API not configured");
    return { verified: false };
  }

  try {
    // In production, call actual Absher API
    // This is a placeholder implementation
    const response = await fetch(`${ABSHER_API_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ABSHER_API_KEY}`,
      },
      body: JSON.stringify({ nationalId, mobileNumber }),
    });

    if (!response.ok) {
      return { verified: false };
    }

    const data = await response.json();
    return {
      verified: data.verified,
      user: data.user,
    };
  } catch (error) {
    console.error("Absher verification error:", error);
    return { verified: false };
  }
}

// =============================================================================
// SADAD PAYMENT INTEGRATION
// =============================================================================

const SADAD_MERCHANT_ID = process.env.SADAD_MERCHANT_ID;
const SADAD_API_URL = process.env.SADAD_API_URL || "https://api.sadad.com";
const SADAD_API_KEY = process.env.SADAD_API_KEY;

interface SadadPayment {
  invoiceNumber: string;
  amount: number;
  currency: string;
  description: string;
  customerName: string;
  customerMobile: string;
  expiryDate: Date;
}

interface SadadBill {
  billNumber: string;
  sadadNumber: string;
  amount: number;
  status: "pending" | "paid" | "expired" | "cancelled";
  expiryDate: string;
}

// Create SADAD bill
export async function createSadadBill(
  payment: SadadPayment
): Promise<SadadBill | null> {
  if (!SADAD_MERCHANT_ID || !SADAD_API_KEY) {
    console.warn("SADAD not configured");
    return null;
  }

  try {
    const response = await fetch(`${SADAD_API_URL}/bills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SADAD_API_KEY}`,
        "X-Merchant-ID": SADAD_MERCHANT_ID,
      },
      body: JSON.stringify({
        invoiceNumber: payment.invoiceNumber,
        amount: payment.amount,
        currency: payment.currency || "SAR",
        description: payment.description,
        customerName: payment.customerName,
        customerMobile: payment.customerMobile,
        expiryDate: payment.expiryDate.toISOString(),
      }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("SADAD bill creation error:", error);
    return null;
  }
}

// Check SADAD payment status
export async function checkSadadStatus(
  billNumber: string
): Promise<SadadBill | null> {
  if (!SADAD_MERCHANT_ID || !SADAD_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(`${SADAD_API_URL}/bills/${billNumber}`, {
      headers: {
        Authorization: `Bearer ${SADAD_API_KEY}`,
        "X-Merchant-ID": SADAD_MERCHANT_ID,
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

// =============================================================================
// NAFATH AUTHENTICATION
// =============================================================================

const NAFATH_APP_ID = process.env.NAFATH_APP_ID;
const NAFATH_SECRET = process.env.NAFATH_SECRET;
const NAFATH_API_URL = process.env.NAFATH_API_URL || "https://api.nafath.sa";

interface NafathRequest {
  requestId: string;
  randomCode: string;
  expiryTime: Date;
}

interface NafathVerification {
  verified: boolean;
  nationalId?: string;
  name?: string;
}

// Initiate Nafath authentication
export async function initiateNafathAuth(
  nationalId: string
): Promise<NafathRequest | null> {
  if (!NAFATH_APP_ID || !NAFATH_SECRET) {
    console.warn("Nafath not configured");
    return null;
  }

  try {
    const response = await fetch(`${NAFATH_API_URL}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-ID": NAFATH_APP_ID,
        "X-App-Secret": NAFATH_SECRET,
      },
      body: JSON.stringify({ nationalId }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Nafath initiation error:", error);
    return null;
  }
}

// Check Nafath verification status
export async function checkNafathStatus(
  requestId: string
): Promise<NafathVerification> {
  if (!NAFATH_APP_ID || !NAFATH_SECRET) {
    return { verified: false };
  }

  try {
    const response = await fetch(`${NAFATH_API_URL}/status/${requestId}`, {
      headers: {
        "X-App-ID": NAFATH_APP_ID,
        "X-App-Secret": NAFATH_SECRET,
      },
    });

    if (!response.ok) {
      return { verified: false };
    }

    return response.json();
  } catch {
    return { verified: false };
  }
}

// =============================================================================
// SAUDI LOCALIZATION HELPERS
// =============================================================================

// Format Saudi Riyal
export function formatSAR(amount: number): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format Saudi phone number
export function formatSaudiPhone(phone: string): string {
  // Remove non-digits
  const digits = phone.replace(/\D/g, "");

  // Handle different formats
  if (digits.startsWith("966")) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  if (digits.startsWith("05")) {
    return `+966 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  if (digits.startsWith("5")) {
    return `+966 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }

  return phone;
}

// Validate Saudi National ID (10 digits, starts with 1 or 2)
export function validateNationalId(id: string): boolean {
  if (!/^[12]\d{9}$/.test(id)) {
    return false;
  }

  // Luhn algorithm for Saudi ID validation
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

// Get Hijri date
export function getHijriDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Saudi regions for address
export const SAUDI_REGIONS = [
  { code: "01", name: "الرياض" },
  { code: "02", name: "مكة المكرمة" },
  { code: "03", name: "المدينة المنورة" },
  { code: "04", name: "القصيم" },
  { code: "05", name: "المنطقة الشرقية" },
  { code: "06", name: "عسير" },
  { code: "07", name: "تبوك" },
  { code: "08", name: "حائل" },
  { code: "09", name: "الحدود الشمالية" },
  { code: "10", name: "جازان" },
  { code: "11", name: "نجران" },
  { code: "12", name: "الباحة" },
  { code: "13", name: "الجوف" },
];
