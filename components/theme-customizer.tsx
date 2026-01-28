"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Palette, Moon, Sun, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ACCENT_COLORS = [
  { name: "أزرق", value: "hsl(221, 83%, 53%)", class: "bg-blue-500" },
  { name: "أخضر", value: "hsl(142, 76%, 36%)", class: "bg-green-600" },
  { name: "بنفسجي", value: "hsl(262, 83%, 58%)", class: "bg-purple-500" },
  { name: "برتقالي", value: "hsl(24, 95%, 53%)", class: "bg-orange-500" },
  { name: "وردي", value: "hsl(330, 81%, 60%)", class: "bg-pink-500" },
  { name: "أحمر", value: "hsl(0, 84%, 60%)", class: "bg-red-500" },
  { name: "تركوازي", value: "hsl(173, 80%, 40%)", class: "bg-teal-500" },
  { name: "ذهبي", value: "hsl(45, 93%, 47%)", class: "bg-amber-500" },
];

const THEME_KEY = "hekmo-accent-color";

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].value);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      setAccentColor(saved);
      document.documentElement.style.setProperty("--primary", saved);
    }
  }, []);

  const handleAccentChange = (color: string) => {
    setAccentColor(color);
    localStorage.setItem(THEME_KEY, color);
    document.documentElement.style.setProperty("--primary", color);
  };

  if (!mounted) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <Palette className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64" dir="rtl">
        <div className="space-y-4">
          {/* Theme Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium">المظهر</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors",
                  theme === "light" && "border-primary bg-primary/10"
                )}
                onClick={() => setTheme("light")}
                type="button"
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs">فاتح</span>
              </button>
              <button
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors",
                  theme === "dark" && "border-primary bg-primary/10"
                )}
                onClick={() => setTheme("dark")}
                type="button"
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs">داكن</span>
              </button>
              <button
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors",
                  theme === "system" && "border-primary bg-primary/10"
                )}
                onClick={() => setTheme("system")}
                type="button"
              >
                <Monitor className="h-5 w-5" />
                <span className="text-xs">تلقائي</span>
              </button>
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-2">
            <label className="text-sm font-medium">اللون الرئيسي</label>
            <div className="grid grid-cols-4 gap-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                    color.class
                  )}
                  key={color.value}
                  onClick={() => handleAccentChange(color.value)}
                  title={color.name}
                  type="button"
                >
                  {accentColor === color.value && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Font size controls
export function FontSizeControl() {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const saved = localStorage.getItem("hekmo-font-size");
    if (saved) {
      const size = parseInt(saved, 10);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}px`;
    }
  }, []);

  const handleChange = (size: number) => {
    setFontSize(size);
    localStorage.setItem("hekmo-font-size", size.toString());
    document.documentElement.style.fontSize = `${size}px`;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">حجم الخط</label>
      <div className="flex items-center gap-2">
        <Button
          disabled={fontSize <= 12}
          onClick={() => handleChange(fontSize - 1)}
          size="icon"
          variant="outline"
        >
          أ-
        </Button>
        <span className="text-sm w-10 text-center">{fontSize}</span>
        <Button
          disabled={fontSize >= 24}
          onClick={() => handleChange(fontSize + 1)}
          size="icon"
          variant="outline"
        >
          أ+
        </Button>
      </div>
    </div>
  );
}
