import { motion } from "framer-motion";
import { BookOpen, Briefcase, Code, Lightbulb, PenTool, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// General-purpose AI capabilities - inspired by ChatGPT/Claude/Perplexity
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
        className="mb-2 text-center text-3xl leading-tight tracking-tight text-foreground md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-foreground">كيف أقدر أساعدك؟</span>
      </motion.h1>

      {/* Subheadline - Clear value proposition */}
      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center text-base text-muted-foreground md:text-lg"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        مساعدك الذكي بالعربي. اسأل أي شيء.
      </motion.p>

      {/* Capability chips - world-class design */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.4 }}
      >
        {CAPABILITIES.map((capability, index) => (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="group flex cursor-default items-center gap-2 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-sm transition-all hover:border-primary/30 hover:bg-card"
            initial={{ opacity: 0, scale: 0.9 }}
            key={capability.label}
            transition={{ delay: 0.5 + index * 0.05 }}
          >
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br shadow-sm",
                capability.gradient
              )}
            >
              <capability.icon className="h-3 w-3 text-white" />
            </div>
            <span className="text-muted-foreground transition-colors group-hover:text-foreground">
              {capability.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Trust indicators - world-class */}
      <motion.div
        animate={{ opacity: 1 }}
        className="mt-8 flex items-center gap-4 text-xs text-muted-foreground/50"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
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
