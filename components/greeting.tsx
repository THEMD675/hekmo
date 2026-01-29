import { motion } from "framer-motion";
import { BookOpen, Briefcase, Code, Lightbulb, PenTool, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * HEKMO GREETING - LOCKED DESIGN
 * Font: Cairo | Theme: Light | Pattern: Material 3
 */

// General-purpose AI capabilities - world-class design
const CAPABILITIES = [
  { icon: Code, label: "برمجة", gradient: "from-emerald-500 to-teal-600" },
  { icon: PenTool, label: "كتابة", gradient: "from-violet-500 to-purple-600" },
  { icon: Lightbulb, label: "أفكار", gradient: "from-amber-400 to-orange-500" },
  { icon: BookOpen, label: "بحث", gradient: "from-cyan-400 to-blue-500" },
  { icon: Briefcase, label: "عمل", gradient: "from-slate-500 to-zinc-600" },
  { icon: Sparkles, label: "إبداع", gradient: "from-pink-400 to-rose-500" },
];

export const Greeting = () => {
  return (
    <div
      className="mx-auto flex size-full max-w-3xl flex-col items-center justify-center px-4 md:px-8"
      key="overview"
    >
      {/* World-class tagline - ChatGPT/Claude pattern */}
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 text-center text-3xl font-medium leading-tight tracking-tight text-foreground md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      >
        <span className="text-foreground">كيف أقدر أساعدك؟</span>
      </motion.h1>

      {/* Subheadline - Clear value proposition */}
      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center text-base text-muted-foreground md:text-lg"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        مساعدك الذكي بالعربي. اسأل أي شيء.
      </motion.p>

      {/* Capability chips - Material 3 Assist Chip pattern */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-2"
        initial={{ opacity: 0, y: 12 }}
        transition={{ delay: 0.2, duration: 0.2 }}
      >
        {CAPABILITIES.map((capability, index) => (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              // Material 3 Assist Chip
              "group flex cursor-default items-center gap-2 rounded-full px-4 py-2 text-sm",
              "bg-secondary shadow-sm transition-all duration-150",
              "hover:shadow-[var(--elevation-1)] hover:bg-secondary/80"
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            key={capability.label}
            transition={{ delay: 0.25 + index * 0.03, duration: 0.15 }}
          >
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br",
                capability.gradient
              )}
            >
              <capability.icon className="h-3 w-3 text-white" />
            </div>
            <span className="text-secondary-foreground font-medium">
              {capability.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Trust indicators - subtle and elegant */}
      <motion.div
        animate={{ opacity: 1 }}
        className="mt-8 flex items-center gap-4 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.2 }}
      >
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          <span>يفهم لهجتك</span>
        </div>
        <span className="text-border">|</span>
        <span>أدوات متقدمة</span>
        <span className="text-border">|</span>
        <span>خصوصية تامة</span>
      </motion.div>
    </div>
  );
};
