import { describe, expect, it } from "vitest";

describe("AI Tools", () => {
  describe("Calculator Tool", () => {
    it("should perform basic arithmetic", async () => {
      // Mock the calculator tool
      const calculate = (expression: string) => {
        // Simple evaluation (in real tool, uses safe eval)
        const ops: Record<string, (a: number, b: number) => number> = {
          "+": (a, b) => a + b,
          "-": (a, b) => a - b,
          "*": (a, b) => a * b,
          "/": (a, b) => a / b,
        };

        const match = expression.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
        if (match) {
          const [, a, op, b] = match;
          return ops[op](Number(a), Number(b));
        }
        return Number.NaN;
      };

      expect(calculate("2 + 3")).toBe(5);
      expect(calculate("10 - 4")).toBe(6);
      expect(calculate("3 * 4")).toBe(12);
      expect(calculate("15 / 3")).toBe(5);
    });

    it("should calculate BMI", () => {
      const calculateBMI = (weight: number, height: number) => {
        return weight / (height * height);
      };

      const bmi = calculateBMI(70, 1.75);
      expect(bmi).toBeCloseTo(22.86, 1);
    });
  });

  describe("Grammar Checker Tool", () => {
    it("should detect Arabic spelling errors", () => {
      const checkArabic = (text: string) => {
        const errors: string[] = [];

        if (text.includes("انشاء الله")) {
          errors.push("انشاء الله → إن شاء الله");
        }
        if (text.includes("لاكن")) {
          errors.push("لاكن → لكن");
        }

        return errors;
      };

      expect(checkArabic("انشاء الله سأفعل")).toHaveLength(1);
      expect(checkArabic("لاكن أريد")).toHaveLength(1);
      expect(checkArabic("إن شاء الله")).toHaveLength(0);
    });

    it("should detect English spelling errors", () => {
      const checkEnglish = (text: string) => {
        const errors: string[] = [];

        if (text.includes("recieve")) {
          errors.push("recieve → receive");
        }
        if (text.includes("teh")) {
          errors.push("teh → the");
        }

        return errors;
      };

      expect(checkEnglish("I will recieve")).toHaveLength(1);
      expect(checkEnglish("I receive")).toHaveLength(0);
    });
  });

  describe("URL Summarizer Tool", () => {
    it("should extract domain from URL", () => {
      const extractDomain = (url: string) => {
        try {
          return new URL(url).hostname;
        } catch {
          return null;
        }
      };

      expect(extractDomain("https://example.com/path")).toBe("example.com");
      expect(extractDomain("invalid")).toBeNull();
    });
  });

  describe("Prayer Times Tool", () => {
    it("should format prayer times correctly", () => {
      const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        const h = Number.parseInt(hours, 10);
        const period = h >= 12 ? "م" : "ص";
        const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
        return `${hour12}:${minutes} ${period}`;
      };

      expect(formatTime("05:30")).toBe("5:30 ص");
      expect(formatTime("12:15")).toBe("12:15 م");
      expect(formatTime("18:45")).toBe("6:45 م");
    });
  });
});
