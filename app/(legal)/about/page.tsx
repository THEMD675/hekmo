import { Metadata } from "next";
import Link from "next/link";
import { Heart, Shield, Zap, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "عن حكمو | مساعدك الذكي للصحة",
  description: "تعرف على حكمو، مساعدك الذكي للصحة باللغة العربية المصمم خصيصاً للمستخدمين في السعودية.",
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-12 px-4" dir="rtl">
      <h1 className="text-4xl font-bold mb-6">عن حكمو</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-xl text-muted-foreground">
          حكمو هو مساعدك الذكي للصحة باللغة العربية، مصمم خصيصاً للمستخدمين في
          المملكة العربية السعودية.
        </p>

        <h2>رؤيتنا</h2>
        <p>
          نؤمن بأن كل شخص يستحق الوصول لمعلومات صحية موثوقة بلغته الأم. لذلك
          أنشأنا حكمو ليكون رفيقك الصحي الذكي الذي يفهم احتياجاتك ويتحدث لغتك.
        </p>

        <h2>قيمنا</h2>
        <div className="grid sm:grid-cols-2 gap-6 not-prose my-8">
          <div className="flex gap-4 p-4 rounded-lg border">
            <Heart className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">الإنسان أولاً</h3>
              <p className="text-sm text-muted-foreground">
                نضع صحة ورفاهية المستخدم في قلب كل ما نفعله
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-4 rounded-lg border">
            <Shield className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">الخصوصية والأمان</h3>
              <p className="text-sm text-muted-foreground">
                بياناتك الصحية محمية بأعلى معايير الأمان
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-4 rounded-lg border">
            <Zap className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">الابتكار</h3>
              <p className="text-sm text-muted-foreground">
                نستخدم أحدث تقنيات الذكاء الاصطناعي لخدمتك
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-4 rounded-lg border">
            <Globe className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1">محلي وعالمي</h3>
              <p className="text-sm text-muted-foreground">
                مصمم للسعودية بمعايير عالمية
              </p>
            </div>
          </div>
        </div>

        <h2>فريقنا</h2>
        <p>
          نحن فريق من المهندسين والباحثين المتحمسين لتقديم تجربة صحية ذكية
          للمستخدم العربي. مقرنا في المملكة العربية السعودية ونعمل على بناء
          مستقبل الرعاية الصحية الرقمية.
        </p>

        <h2>تواصل معنا</h2>
        <p>
          نحب سماع رأيك! تواصل معنا عبر:
        </p>
        <ul>
          <li>
            البريد الإلكتروني:{" "}
            <a href="mailto:hello@hekmo.ai">hello@hekmo.ai</a>
          </li>
          <li>
            تويتر:{" "}
            <a href="https://twitter.com/hekmo_ai" target="_blank">
              @hekmo_ai
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
