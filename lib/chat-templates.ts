// Chat templates for common health queries

export interface ChatTemplate {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  category: "sleep" | "stress" | "fitness" | "nutrition" | "general";
  prompt: string;
  promptAr: string;
}

export const chatTemplates: ChatTemplate[] = [
  // Sleep
  {
    id: "sleep-protocol",
    title: "Sleep Optimization",
    titleAr: "تحسين النوم",
    description: "Get a personalized sleep protocol",
    descriptionAr: "احصل على بروتوكول نوم مخصص",
    icon: "🌙",
    category: "sleep",
    prompt: "I want to optimize my sleep. I currently sleep from [time] to [time]. My main issues are [issues]. Give me a complete sleep protocol.",
    promptAr: "أريد تحسين نومي. حالياً أنام من [الوقت] إلى [الوقت]. مشاكلي الرئيسية هي [المشاكل]. أعطني بروتوكول نوم كامل.",
  },
  {
    id: "morning-routine",
    title: "Morning Routine",
    titleAr: "روتين الصباح",
    description: "Design your optimal morning",
    descriptionAr: "صمم صباحك المثالي",
    icon: "☀️",
    category: "sleep",
    prompt: "Help me create an optimal morning routine. I wake up at [time] and need to be productive by [time].",
    promptAr: "ساعدني في إنشاء روتين صباحي مثالي. أستيقظ في [الوقت] وأحتاج أن أكون منتجاً بحلول [الوقت].",
  },
  
  // Stress
  {
    id: "stress-relief",
    title: "Stress Relief",
    titleAr: "تخفيف التوتر",
    description: "Immediate stress reduction techniques",
    descriptionAr: "تقنيات فورية لتخفيف التوتر",
    icon: "🧘",
    category: "stress",
    prompt: "I'm feeling very stressed right now. Give me immediate techniques to calm down.",
    promptAr: "أشعر بتوتر شديد الآن. أعطني تقنيات فورية للهدوء.",
  },
  {
    id: "breathing-exercise",
    title: "Breathing Exercises",
    titleAr: "تمارين التنفس",
    description: "Learn effective breathing techniques",
    descriptionAr: "تعلم تقنيات التنفس الفعالة",
    icon: "💨",
    category: "stress",
    prompt: "Teach me the best breathing exercises for stress relief and focus.",
    promptAr: "علمني أفضل تمارين التنفس لتخفيف التوتر والتركيز.",
  },
  {
    id: "cold-exposure",
    title: "Cold Exposure",
    titleAr: "التعرض للبرد",
    description: "Cold shower/ice bath protocol",
    descriptionAr: "بروتوكول الاستحمام البارد",
    icon: "🧊",
    category: "stress",
    prompt: "I want to start cold exposure. How do I begin safely and what are the benefits?",
    promptAr: "أريد أن أبدأ التعرض للبرد. كيف أبدأ بأمان وما هي الفوائد؟",
  },

  // Fitness
  {
    id: "zone2-cardio",
    title: "Zone 2 Training",
    titleAr: "تمارين Zone 2",
    description: "Longevity cardio protocol",
    descriptionAr: "بروتوكول القلب لطول العمر",
    icon: "❤️",
    category: "fitness",
    prompt: "Explain Zone 2 cardio and give me a weekly plan. I have [equipment] available.",
    promptAr: "اشرح لي تمارين Zone 2 وأعطني خطة أسبوعية. لدي [المعدات] المتاحة.",
  },
  {
    id: "strength-training",
    title: "Strength Training",
    titleAr: "تدريب القوة",
    description: "Build muscle and strength",
    descriptionAr: "بناء العضلات والقوة",
    icon: "💪",
    category: "fitness",
    prompt: "Create a strength training program for me. I can train [days] per week. My goal is [goal].",
    promptAr: "أنشئ لي برنامج تدريب قوة. أستطيع التدريب [أيام] في الأسبوع. هدفي هو [الهدف].",
  },
  {
    id: "vo2max",
    title: "VO2 Max Training",
    titleAr: "تدريب VO2 Max",
    description: "Improve cardiovascular capacity",
    descriptionAr: "تحسين السعة القلبية",
    icon: "🫁",
    category: "fitness",
    prompt: "How do I improve my VO2 max? Give me a training protocol.",
    promptAr: "كيف أحسن VO2 max؟ أعطني بروتوكول تدريب.",
  },

  // Nutrition
  {
    id: "calculate-macros",
    title: "Calculate Macros",
    titleAr: "حساب الماكروز",
    description: "Get your personalized macros",
    descriptionAr: "احصل على الماكروز المخصصة لك",
    icon: "🥗",
    category: "nutrition",
    prompt: "Calculate my macros. I'm [height]cm, [weight]kg, [age] years old, [activity level] active. My goal is [goal].",
    promptAr: "احسب لي الماكروز. طولي [الطول] سم، وزني [الوزن] كجم، عمري [العمر] سنة، نشاطي [مستوى النشاط]. هدفي [الهدف].",
  },
  {
    id: "fasting-protocol",
    title: "Fasting Protocol",
    titleAr: "بروتوكول الصيام",
    description: "Intermittent fasting guide",
    descriptionAr: "دليل الصيام المتقطع",
    icon: "⏰",
    category: "nutrition",
    prompt: "I want to try intermittent fasting. What protocol do you recommend and how do I start?",
    promptAr: "أريد تجربة الصيام المتقطع. ما البروتوكول الذي توصي به وكيف أبدأ؟",
  },
  {
    id: "supplements",
    title: "Supplement Stack",
    titleAr: "المكملات الغذائية",
    description: "Evidence-based supplements",
    descriptionAr: "المكملات المبنية على الأدلة",
    icon: "💊",
    category: "nutrition",
    prompt: "What supplements should I take? I'm focused on [goal]. Give me specific doses.",
    promptAr: "ما المكملات التي يجب أن أتناولها؟ تركيزي على [الهدف]. أعطني جرعات محددة.",
  },

  // General
  {
    id: "health-checkup",
    title: "Health Checkup",
    titleAr: "فحص صحي",
    description: "Get a health assessment",
    descriptionAr: "احصل على تقييم صحي",
    icon: "🩺",
    category: "general",
    prompt: "Do a health assessment for me. Ask me questions about my lifestyle, sleep, stress, exercise, and nutrition.",
    promptAr: "قم بتقييم صحي لي. اسألني عن نمط حياتي، نومي، توتري، تمارينني، وتغذيتي.",
  },
  {
    id: "prayer-times",
    title: "Prayer Times",
    titleAr: "أوقات الصلاة",
    description: "Get prayer times for your city",
    descriptionAr: "احصل على أوقات الصلاة لمدينتك",
    icon: "🕌",
    category: "general",
    prompt: "What are the prayer times for [city] today?",
    promptAr: "ما هي أوقات الصلاة في [المدينة] اليوم؟",
  },
  {
    id: "ramadan-protocol",
    title: "Ramadan Health",
    titleAr: "صحة رمضان",
    description: "Optimize health during Ramadan",
    descriptionAr: "تحسين الصحة في رمضان",
    icon: "🌙",
    category: "general",
    prompt: "Give me a complete health protocol for Ramadan fasting including suhoor, iftar, sleep, and exercise timing.",
    promptAr: "أعطني بروتوكول صحي كامل لصيام رمضان يشمل السحور، الإفطار، النوم، وتوقيت التمارين.",
  },
];

export const templateCategories = [
  { id: "all", label: "الكل", labelEn: "All" },
  { id: "sleep", label: "النوم", labelEn: "Sleep" },
  { id: "stress", label: "التوتر", labelEn: "Stress" },
  { id: "fitness", label: "اللياقة", labelEn: "Fitness" },
  { id: "nutrition", label: "التغذية", labelEn: "Nutrition" },
  { id: "general", label: "عام", labelEn: "General" },
];

export function getTemplatesByCategory(category: string): ChatTemplate[] {
  if (category === "all") return chatTemplates;
  return chatTemplates.filter((t) => t.category === category);
}
