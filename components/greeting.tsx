import { motion } from "framer-motion";
import { Apple, Brain, Dumbbell, Heart, Moon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Health categories - patterns inspired by Headspace/WHOOP/Oura
const CATEGORIES = [
  { icon: Moon, label: "نوم أفضل", gradient: "from-indigo-500 to-purple-600" },
  { icon: Zap, label: "طاقة أعلى", gradient: "from-amber-400 to-orange-500" },
  { icon: Brain, label: "تركيز أقوى", gradient: "from-cyan-400 to-blue-500" },
  { icon: Dumbbell, label: "لياقة", gradient: "from-green-400 to-emerald-500" },
  { icon: Heart, label: "صحة نفسية", gradient: "from-pink-400 to-rose-500" },
  { icon: Apple, label: "تغذية", gradient: "from-lime-400 to-green-500" },
];

export const Greeting = () => {
  return (
    <div
      className="mx-auto flex size-full max-w-3xl flex-col items-center justify-center px-4 md:px-8"
      key="overview"
    >
      {/* World-class tagline - Claude pattern: "Impossible? Possible." */}
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 text-center font-serif text-3xl leading-tight tracking-tight text-foreground md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-muted-foreground/60">تعبان؟</span>
        <br />
        <span className="text-foreground">بكامل طاقتك.</span>
      </motion.h1>

      {/* Subheadline - Clear value proposition */}
      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center text-base text-muted-foreground md:text-lg"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        مدربك الصحي الشخصي، بالعربي
      </motion.p>

      {/* Health categories - world-class chips */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.4 }}
      >
        {CATEGORIES.map((category, index) => (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="group flex cursor-default items-center gap-2 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-sm transition-all hover:border-primary/30 hover:bg-card"
            initial={{ opacity: 0, scale: 0.9 }}
            key={category.label}
            transition={{ delay: 0.5 + index * 0.05 }}
          >
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br shadow-sm",
                category.gradient
              )}
            >
              <category.icon className="h-3 w-3 text-white" />
            </div>
            <span className="text-muted-foreground transition-colors group-hover:text-foreground">
              {category.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Trust indicators - world-class social proof */}
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
        <span>بروتوكولات مثبتة علميا</span>
        <span className="text-border">|</span>
        <span>خصوصية تامة</span>
      </motion.div>
    </div>
  );
};
