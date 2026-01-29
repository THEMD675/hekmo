import { tool } from "ai";
import { z } from "zod";

export const prayerTimesTool = tool({
  description: "Get Islamic prayer times for a specific city in Saudi Arabia or any location. Use this when the user asks about prayer times, salah times, or أوقات الصلاة.",
  inputSchema: z.object({
    city: z.string().describe("City name (e.g., Riyadh, Jeddah, Mecca)"),
    country: z.string().default("Saudi Arabia").describe("Country name"),
    date: z.string().optional().describe("Date in DD-MM-YYYY format, defaults to today"),
  }),
  execute: async ({ city, country, date }) => {
    try {
      const today = date || new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${today}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prayer times");
      }

      const data = await response.json();
      const timings = data.data?.timings;
      const hijriDate = data.data?.date?.hijri;

      if (!timings) {
        throw new Error("No prayer times found");
      }

      return {
        success: true,
        city,
        country,
        date: {
          gregorian: data.data?.date?.gregorian?.date,
          hijri: hijriDate ? `${hijriDate.day} ${hijriDate.month.ar} ${hijriDate.year}` : null,
          hijriEn: hijriDate ? `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}` : null,
        },
        prayerTimes: {
          fajr: timings.Fajr,
          sunrise: timings.Sunrise,
          dhuhr: timings.Dhuhr,
          asr: timings.Asr,
          maghrib: timings.Maghrib,
          isha: timings.Isha,
        },
        prayerTimesArabic: {
          الفجر: timings.Fajr,
          الشروق: timings.Sunrise,
          الظهر: timings.Dhuhr,
          العصر: timings.Asr,
          المغرب: timings.Maghrib,
          العشاء: timings.Isha,
        },
      };
    } catch (error) {
      console.error("Prayer times error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get prayer times",
      };
    }
  },
});
