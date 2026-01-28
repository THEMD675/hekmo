import { describe, it, expect } from "vitest";
import {
  normalizeArabic,
  isArabic,
  isSaudiDialect,
  extractArabicKeywords,
  toArabicNumerals,
  extractHealthTerms,
} from "@/lib/arabic-nlp";

describe("Arabic NLP", () => {
  describe("normalizeArabic", () => {
    it("should remove diacritics", () => {
      expect(normalizeArabic("مَرْحَبًا")).toBe("مرحبا");
    });

    it("should normalize alef variants", () => {
      expect(normalizeArabic("إسلام أحمد آمال")).toBe("اسلام احمد امال");
    });

    it("should normalize teh marbuta", () => {
      expect(normalizeArabic("مدرسة")).toBe("مدرسه");
    });

    it("should remove tatweel", () => {
      expect(normalizeArabic("مـرحـبـا")).toBe("مرحبا");
    });
  });

  describe("isArabic", () => {
    it("should return true for Arabic text", () => {
      expect(isArabic("مرحبا بك")).toBe(true);
    });

    it("should return false for English text", () => {
      expect(isArabic("Hello world")).toBe(false);
    });

    it("should handle mixed text", () => {
      expect(isArabic("مرحبا Hello")).toBe(true); // More Arabic
      expect(isArabic("Hello مرحبا World")).toBe(false); // More English
    });
  });

  describe("isSaudiDialect", () => {
    it("should detect Saudi markers", () => {
      expect(isSaudiDialect("وش تبي")).toBe(true);
      expect(isSaudiDialect("ايش رايك")).toBe(true);
      expect(isSaudiDialect("كيف الحال")).toBe(true);
    });

    it("should return false for MSA", () => {
      expect(isSaudiDialect("كيف حالك")).toBe(false);
    });
  });

  describe("extractArabicKeywords", () => {
    it("should extract meaningful keywords", () => {
      const keywords = extractArabicKeywords("الصحة والتغذية مهمة للجسم");
      expect(keywords.length).toBeGreaterThan(0);
      expect(keywords).not.toContain("من");
      expect(keywords).not.toContain("في");
    });

    it("should filter stopwords", () => {
      const keywords = extractArabicKeywords("هو في المنزل");
      expect(keywords).not.toContain("هو");
      expect(keywords).not.toContain("في");
    });
  });

  describe("toArabicNumerals", () => {
    it("should convert numbers to Arabic numerals", () => {
      expect(toArabicNumerals(123)).toBe("١٢٣");
      expect(toArabicNumerals("456")).toBe("٤٥٦");
      expect(toArabicNumerals(0)).toBe("٠");
    });
  });

  describe("extractHealthTerms", () => {
    it("should extract health-related terms", () => {
      const terms = extractHealthTerms("أريد تحسين نومي وصحتي");
      expect(terms).toContain("نوم");
      expect(terms).toContain("صحة");
    });

    it("should return empty for non-health text", () => {
      const terms = extractHealthTerms("الطقس جميل اليوم");
      expect(terms.length).toBe(0);
    });
  });
});
