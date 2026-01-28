"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  MessageSquarePlus,
  Search,
  Settings,
  Moon,
  Sun,
  LogOut,
  User,
  Keyboard,
  HelpCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      // Cmd+N or Ctrl+N for new chat
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/");
      }

      // Cmd+/ for keyboard shortcuts help
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router]);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandInput placeholder="ابحث عن أمر أو محادثة..." />
      <CommandList>
        <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>

        <CommandGroup heading="إجراءات سريعة">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
          >
            <MessageSquarePlus className="ml-2 h-4 w-4" />
            <span>محادثة جديدة</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => {
              // Focus search in sidebar
              const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
              searchInput?.focus();
            })}
          >
            <Search className="ml-2 h-4 w-4" />
            <span>البحث في المحادثات</span>
            <CommandShortcut>⌘F</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="المظهر">
          <CommandItem
            onSelect={() => runCommand(() => setTheme("light"))}
          >
            <Sun className="ml-2 h-4 w-4" />
            <span>الوضع الفاتح</span>
            {theme === "light" && <span className="mr-auto text-xs">✓</span>}
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => setTheme("dark"))}
          >
            <Moon className="ml-2 h-4 w-4" />
            <span>الوضع الداكن</span>
            {theme === "dark" && <span className="mr-auto text-xs">✓</span>}
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => setTheme("system"))}
          >
            <Settings className="ml-2 h-4 w-4" />
            <span>تلقائي (حسب النظام)</span>
            {theme === "system" && <span className="mr-auto text-xs">✓</span>}
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="الحساب">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="ml-2 h-4 w-4" />
            <span>الإعدادات</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/profile"))}
          >
            <User className="ml-2 h-4 w-4" />
            <span>الملف الشخصي</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => signOut())}
          >
            <LogOut className="ml-2 h-4 w-4" />
            <span>تسجيل الخروج</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="مساعدة">
          <CommandItem onSelect={() => setOpen(false)}>
            <Keyboard className="ml-2 h-4 w-4" />
            <span>اختصارات لوحة المفاتيح</span>
            <CommandShortcut>⌘/</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => window.open("mailto:support@hekmo.ai"))}
          >
            <HelpCircle className="ml-2 h-4 w-4" />
            <span>المساعدة والدعم</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
