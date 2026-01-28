"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Mic,
  Shield,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  image?: string;
}

const STEPS: OnboardingStep[] = [
  {
    icon: <MessageSquare className="h-12 w-12" />,
    title: "مرحباً بك في حكمو",
    description:
      "مساعدك الذكي بالعربي. اسألني أي سؤال عن البرمجة، الكتابة، البحث، أو أي موضوع.",
  },
  {
    icon: <Mic className="h-12 w-12" />,
    title: "تحدث بصوتك",
    description:
      "يمكنك التحدث معي بصوتك بالعربية. اضغط على أيقونة الميكروفون وابدأ الحديث.",
  },
  {
    icon: <Sparkles className="h-12 w-12" />,
    title: "أدوات متقدمة",
    description:
      "أستطيع كتابة الكود، البحث في الإنترنت، قراءة الملفات، توليد الصور، والمزيد.",
  },
  {
    icon: <Shield className="h-12 w-12" />,
    title: "خصوصية تامة",
    description:
      "بياناتك آمنة ومحمية. لا نشارك معلوماتك مع أي طرف ثالث.",
  },
];

const ONBOARDING_KEY = "hekmo-onboarding-completed";

export function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if onboarding was completed
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setShow(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShow(false);
    router.refresh();
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!show) return null;

  const currentStep = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, idx) => (
            <button
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                idx === step ? "bg-primary" : "bg-muted"
              )}
              key={idx}
              onClick={() => setStep(idx)}
              type="button"
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center space-y-6">
          <div className="flex justify-center text-primary">
            {currentStep.icon}
          </div>
          <h2 className="text-2xl font-bold">{currentStep.title}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12">
          <Button
            disabled={step === 0}
            onClick={handlePrev}
            size="lg"
            variant="ghost"
          >
            <ChevronRight className="h-5 w-5 ml-1" />
            السابق
          </Button>

          <Button onClick={handleSkip} size="sm" variant="link">
            تخطي
          </Button>

          <Button onClick={handleNext} size="lg">
            {step === STEPS.length - 1 ? (
              <>
                <Check className="h-5 w-5 ml-1" />
                ابدأ
              </>
            ) : (
              <>
                التالي
                <ChevronLeft className="h-5 w-5 mr-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Check if onboarding is needed
export function useOnboardingStatus() {
  const [completed, setCompleted] = useState(true);

  useEffect(() => {
    const status = localStorage.getItem(ONBOARDING_KEY);
    setCompleted(!!status);
  }, []);

  const reset = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setCompleted(false);
  };

  return { completed, reset };
}
