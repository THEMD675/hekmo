import { auth } from "@/app/(auth)/auth";

// User preferences storage (use database in production)
const preferencesStore = new Map<string, UserPreferences>();

interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "ar" | "en";
  fontSize: number;
  accentColor: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
  };
  chat: {
    defaultModel: string;
    sendOnEnter: boolean;
    showTimestamps: boolean;
    compactMode: boolean;
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  language: "ar",
  fontSize: 16,
  accentColor: "hsl(221, 83%, 53%)",
  notifications: {
    email: true,
    push: true,
    marketing: false,
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
  },
  chat: {
    defaultModel: "gpt-4o-mini",
    sendOnEnter: true,
    showTimestamps: false,
    compactMode: false,
  },
};

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const preferences =
    preferencesStore.get(session.user.id) || DEFAULT_PREFERENCES;

  return Response.json(preferences);
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates = await request.json();

    // Get current preferences
    const current =
      preferencesStore.get(session.user.id) || DEFAULT_PREFERENCES;

    // Deep merge updates
    const newPreferences = deepMerge(current, updates);

    // Store updated preferences
    preferencesStore.set(session.user.id, newPreferences);

    return Response.json({
      success: true,
      preferences: newPreferences,
    });
  } catch (error) {
    console.error("Preferences update error:", error);
    return Response.json(
      { error: "فشل حفظ التفضيلات" },
      { status: 500 }
    );
  }
}

// Deep merge helper
function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };

  for (const key in source) {
    if (
      source[key] !== null &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      output[key] = deepMerge(
        (target as Record<string, unknown>)[key] as T[Extract<keyof T, string>],
        source[key] as Partial<T[Extract<keyof T, string>]>
      );
    } else if (source[key] !== undefined) {
      output[key] = source[key] as T[Extract<keyof T, string>];
    }
  }

  return output;
}
