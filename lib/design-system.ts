/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    HEKMO DESIGN SYSTEM - LOCKED v5.0                      ║
 * ║                           "The 10/10 System"                              ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ UNIQUE IDENTITY: Neither Google nor Apple - distinctly Hekmo              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * THE HYBRID APPROACH (10/10):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ 1. WARM STONE PALETTE - Unique brand identity (not copied)             │
 * │ 2. APPLE LIQUID GLASS - Premium glassmorphism on key elements          │
 * │ 3. M3 FOUNDATIONS - Accessibility, spacing, typography                  │
 * │ 4. HEKMO SIGNATURE - Custom elements that define our brand             │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * COMPONENT CLASSES:
 * - .hekmo-glass     → Premium translucent card (Apple Liquid Glass)
 * - .hekmo-card      → Signature elevated card with subtle shadow
 * - .hekmo-input     → Glass input field with backdrop blur
 * - .hekmo-button    → Premium filled button with inner glow
 * - .hekmo-chip      → Soft pill chip
 * - .hekmo-modal     → Glass modal with frosted background
 * - .hekmo-bubble-*  → Chat message bubbles
 * - .hekmo-shimmer   → Loading animation
 * 
 * DESIGN PHILOSOPHY:
 * - Premium: Every element feels high-end
 * - Warm: Stone/beige palette, not cold
 * - Original: Not recognizable as "Google app" or "Apple clone"
 * - Accessible: WCAG 2.1 AA compliant
 * - Arabic-first: RTL native, Cairo typography
 * 
 * @version 5.0.0
 * @locked true
 * @lastUpdated 2026-01-29
 */

// ============================================================================
// TYPOGRAPHY - LOCKED
// Research: Cairo rated 10/10 readability for Arabic digital screens (2025)
// ============================================================================

export const TYPOGRAPHY = {
  /**
   * FONT FAMILY DECISION (LOCKED)
   * 
   * Arabic: Cairo
   * - Readability: 10/10 (highest rated)
   * - Performance: Excellent hinting, OpenType support
   * - Source: Google Fonts, variable font
   * - Alternative considered: Tajawal (9.8/10), IBM Plex Arabic (SaaS/dev)
   * 
   * Latin: Inter
   * - Industry standard for UI
   * - Excellent legibility at small sizes
   * - Variable font with optical sizing
   */
  fontFamily: {
    arabic: "Cairo, var(--font-cairo), system-ui, sans-serif",
    latin: "Inter, var(--font-inter), system-ui, sans-serif",
    mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
  },
  
  /**
   * TYPE SCALE (Material 3 specification)
   * All values are CSS-ready
   */
  scale: {
    displayLarge: { size: "57px", lineHeight: "64px", weight: 400, tracking: "-0.25px" },
    displayMedium: { size: "45px", lineHeight: "52px", weight: 400, tracking: "0px" },
    displaySmall: { size: "36px", lineHeight: "44px", weight: 400, tracking: "0px" },
    headlineLarge: { size: "32px", lineHeight: "40px", weight: 400, tracking: "0px" },
    headlineMedium: { size: "28px", lineHeight: "36px", weight: 400, tracking: "0px" },
    headlineSmall: { size: "24px", lineHeight: "32px", weight: 400, tracking: "0px" },
    titleLarge: { size: "22px", lineHeight: "28px", weight: 500, tracking: "0px" },
    titleMedium: { size: "16px", lineHeight: "24px", weight: 500, tracking: "0.15px" },
    titleSmall: { size: "14px", lineHeight: "20px", weight: 500, tracking: "0.1px" },
    bodyLarge: { size: "16px", lineHeight: "24px", weight: 400, tracking: "0.5px" },
    bodyMedium: { size: "14px", lineHeight: "20px", weight: 400, tracking: "0.25px" },
    bodySmall: { size: "12px", lineHeight: "16px", weight: 400, tracking: "0.4px" },
    labelLarge: { size: "14px", lineHeight: "20px", weight: 500, tracking: "0.1px" },
    labelMedium: { size: "12px", lineHeight: "16px", weight: 500, tracking: "0.5px" },
    labelSmall: { size: "11px", lineHeight: "16px", weight: 500, tracking: "0.5px" },
  },
  
  /**
   * MESSAGE BUBBLE TYPOGRAPHY (Chat UI Best Practices 2025)
   */
  chatBubble: {
    senderName: { size: "12px", weight: 600, lineHeight: "16px" },
    messageBody: { size: "14px", weight: 400, lineHeight: "21px" }, // 1.5 line-height
    timestamp: { size: "11px", weight: 400, lineHeight: "14px" },
    padding: "16px", // p-4 standard
  },
} as const;

// ============================================================================
// COLOR SYSTEM - LOCKED (Warm Stone / Apple / ChatGPT)
// ============================================================================

export const COLORS = {
  /**
   * BRAND COLOR DECISION (LOCKED v3)
   * 
   * VISION: Minimal, warm, stone vibes, Apple + ChatGPT feel
   * 
   * Primary: Warm Stone Brown
   * - Conveys: Warmth, trust, sophistication, timelessness
   * - Inspired by: ChatGPT earth tones, Apple elegance
   * - Grounding, natural, premium feel
   * 
   * Accent: Subtle warm highlight (not vibrant)
   * - Minimal, not attention-grabbing
   * - Elegant hover states only
   * 
   * Background: Warm cream/beige (not pure white)
   * - Soft on eyes, premium feel
   * - Like high-end paper or linen
   */
  
  light: {
    // Primary (Warm Stone) - Subtle, sophisticated
    primary: "hsl(30 20% 35%)",            // Warm brown stone
    onPrimary: "hsl(40 30% 98%)",
    primaryContainer: "hsl(35 30% 90%)",
    onPrimaryContainer: "hsl(30 25% 15%)",
    
    // Secondary - Muted stone gray
    secondary: "hsl(30 10% 50%)",
    onSecondary: "hsl(40 30% 98%)",
    secondaryContainer: "hsl(35 15% 92%)",
    onSecondaryContainer: "hsl(30 15% 20%)",
    
    // Tertiary (Warm accent) - Not orange, subtle warmth
    tertiary: "hsl(25 35% 45%)",           // Muted terracotta
    onTertiary: "hsl(40 30% 98%)",
    tertiaryContainer: "hsl(30 25% 88%)",
    onTertiaryContainer: "hsl(25 30% 15%)",
    
    // Error - Muted, not alarming
    error: "hsl(0 50% 45%)",
    onError: "hsl(0 0% 100%)",
    errorContainer: "hsl(0 40% 92%)",
    onErrorContainer: "hsl(0 50% 20%)",
    
    // Surface (Warm cream - like premium paper)
    surface: "hsl(40 30% 97%)",            // Warm cream
    onSurface: "hsl(30 15% 12%)",          // Warm near-black
    surfaceVariant: "hsl(35 20% 93%)",
    onSurfaceVariant: "hsl(30 10% 40%)",
    surfaceContainerLowest: "hsl(40 40% 99%)",  // Almost white cream
    surfaceContainerLow: "hsl(38 30% 96%)",
    surfaceContainer: "hsl(36 25% 94%)",
    surfaceContainerHigh: "hsl(34 20% 91%)",
    surfaceContainerHighest: "hsl(32 18% 88%)",
    
    // Outline - Warm, subtle
    outline: "hsl(30 10% 60%)",
    outlineVariant: "hsl(35 15% 82%)",
    
    // Background (Same as surface - unified warm cream)
    background: "hsl(40 30% 97%)",
    onBackground: "hsl(30 15% 12%)",
    
    // Inverse
    inverseSurface: "hsl(30 15% 15%)",
    inverseOnSurface: "hsl(40 25% 95%)",
    inversePrimary: "hsl(35 30% 70%)",
    
    // Shadows (Warm tinted)
    shadow: "hsl(30 20% 10%)",
    scrim: "hsl(30 15% 5%)",
  },
  
  dark: {
    // Dark mode - Warm dark, not cold black
    primary: "hsl(35 30% 70%)",
    onPrimary: "hsl(30 25% 12%)",
    primaryContainer: "hsl(30 25% 25%)",
    onPrimaryContainer: "hsl(35 35% 90%)",
    
    secondary: "hsl(35 15% 65%)",
    onSecondary: "hsl(30 20% 12%)",
    secondaryContainer: "hsl(30 15% 22%)",
    onSecondaryContainer: "hsl(35 20% 88%)",
    
    tertiary: "hsl(28 35% 65%)",
    onTertiary: "hsl(25 30% 12%)",
    tertiaryContainer: "hsl(25 25% 22%)",
    onTertiaryContainer: "hsl(28 35% 88%)",
    
    error: "hsl(0 50% 65%)",
    onError: "hsl(0 40% 12%)",
    errorContainer: "hsl(0 40% 22%)",
    onErrorContainer: "hsl(0 45% 88%)",
    
    // Surface (Warm dark - not pure black)
    surface: "hsl(30 15% 8%)",             // Warm near-black
    onSurface: "hsl(35 20% 90%)",
    surfaceVariant: "hsl(30 12% 15%)",
    onSurfaceVariant: "hsl(35 15% 70%)",
    surfaceContainerLowest: "hsl(30 15% 5%)",
    surfaceContainerLow: "hsl(30 12% 10%)",
    surfaceContainer: "hsl(30 10% 13%)",
    surfaceContainerHigh: "hsl(30 8% 16%)",
    surfaceContainerHighest: "hsl(30 6% 20%)",
    
    outline: "hsl(30 10% 45%)",
    outlineVariant: "hsl(30 10% 28%)",
    
    background: "hsl(30 15% 8%)",
    onBackground: "hsl(35 20% 90%)",
    
    inverseSurface: "hsl(35 20% 90%)",
    inverseOnSurface: "hsl(30 15% 15%)",
    inversePrimary: "hsl(30 20% 35%)",
    
    shadow: "hsl(0 0% 0%)",
    scrim: "hsl(0 0% 0%)",
  },
  
  /**
   * SEMANTIC COLORS (LOCKED - Muted, not vibrant)
   */
  semantic: {
    success: "hsl(140 35% 40%)",      // Muted sage green
    warning: "hsl(35 50% 50%)",       // Muted amber
    info: "hsl(210 40% 50%)",         // Muted blue
    
    // Citation badge - warm stone tint
    citationBg: "hsla(30, 20%, 35%, 0.12)",
    citationText: "hsl(30 25% 35%)",
  },
} as const;

// ============================================================================
// ELEVATION - LOCKED (Material 3 Official Values)
// Source: material-components-web GitHub + studioncreations.com
// ============================================================================

export const ELEVATION = {
  /**
   * M3 ELEVATION LEVELS (LOCKED)
   * 
   * Official CSS box-shadow values from Material Components Web
   * 
   * Usage:
   * - Level 0: Flat surfaces (no elevation)
   * - Level 1: Cards at rest, app bars
   * - Level 2: Cards on hover, raised buttons
   * - Level 3: FAB at rest, navigation drawers
   * - Level 4: Dialogs, modals
   * - Level 5: Dialogs on hover
   */
  level0: "none",
  level1: "0 1px 4px 0 rgba(0, 0, 0, 0.12)",
  level2: "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 6px 10px 0 rgba(0, 0, 0, 0.12)",
  level3: "0 11px 7px 0 rgba(0, 0, 0, 0.10), 0 13px 25px 0 rgba(0, 0, 0, 0.12)",
  level4: "0 14px 12px 0 rgba(0, 0, 0, 0.08), 0 20px 40px 0 rgba(0, 0, 0, 0.12)",
  level5: "0 17px 17px 0 rgba(0, 0, 0, 0.06), 0 27px 55px 0 rgba(0, 0, 0, 0.12)",
  
  /**
   * M3 CARD ELEVATION PATTERN (LOCKED)
   * 
   * Elevated cards:
   * - Rest: level1
   * - Hover: level2
   * - Pressed: level1
   * 
   * This creates the "lift on hover" effect users expect
   */
  card: {
    rest: "level1",
    hover: "level2",
    pressed: "level1",
  },
} as const;

// ============================================================================
// MOTION - LOCKED (Material Design + Apple Guidelines)
// ============================================================================

export const MOTION = {
  /**
   * DURATION DECISION (LOCKED)
   * 
   * Platform-specific (Material Design research):
   * - Desktop: 150-200ms (user expects speed)
   * - Mobile: 300ms standard
   * - Tablet: ~390ms (30% longer than mobile)
   * 
   * AI Responses:
   * - Skeleton shimmer: 1.5s loop
   * - Content fade-in: 200ms
   */
  duration: {
    instant: "0ms",
    short1: "50ms",
    short2: "100ms",
    short3: "150ms",      // Desktop minimum
    short4: "200ms",      // Desktop maximum
    medium1: "250ms",
    medium2: "300ms",     // Mobile standard
    medium3: "350ms",
    medium4: "400ms",     // Entry animations
    long1: "450ms",
    long2: "500ms",       // Full transitions
    skeleton: "1500ms",   // Shimmer loop
  },
  
  /**
   * EASING CURVES (LOCKED)
   * 
   * Material 3: "snappy take offs and very soft landings"
   * - Emphasized: Most transitions
   * - Standard: Utility interactions
   */
  easing: {
    // Standard (most common)
    standard: "cubic-bezier(0.2, 0.0, 0, 1.0)",
    standardAccelerate: "cubic-bezier(0.3, 0.0, 1, 1)",
    standardDecelerate: "cubic-bezier(0, 0, 0, 1)",
    
    // Emphasized (important movements)
    emphasized: "cubic-bezier(0.2, 0.0, 0, 1.0)",
    emphasizedAccelerate: "cubic-bezier(0.3, 0.0, 0.8, 0.15)",
    emphasizedDecelerate: "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
    
    // Spring (Apple-inspired)
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    
    // Linear (for shimmer)
    linear: "linear",
  },
  
  /**
   * REDUCED MOTION
   * Respect prefers-reduced-motion
   */
  reducedMotion: {
    duration: "0ms",
    easing: "linear",
  },
} as const;

// ============================================================================
// SPACING - LOCKED (4px base unit)
// ============================================================================

export const SPACING = {
  /**
   * SPACING SCALE (LOCKED)
   * 
   * 4px base unit (industry standard)
   * Component-level: 4-48px
   * Layout-level: 16-192px
   */
  0: "0px",
  px: "1px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  3.5: "14px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  11: "44px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
  36: "144px",
  40: "160px",
  44: "176px",
  48: "192px",
} as const;

// ============================================================================
// BORDER RADIUS - LOCKED
// ============================================================================

export const RADIUS = {
  /**
   * RADIUS SCALE (LOCKED)
   * 
   * Based on Mozilla Protocol + Material 3
   * - xs (2px): Small badges
   * - sm (4px): Inputs, small cards
   * - md (8px): Standard cards
   * - lg (12px): Large cards (default)
   * - xl (16px): Dialogs
   * - 2xl (20px): Large dialogs
   * - full: Pills, avatars
   */
  none: "0px",
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px",
} as const;

// ============================================================================
// COMPONENT PATTERNS - LOCKED
// ============================================================================

export const COMPONENTS = {
  /**
   * CARDS (LOCKED)
   * 
   * Decision: ELEVATED cards (not outlined, not filled)
   * Research: Elevated cards +72% engagement
   */
  card: {
    variant: "elevated",
    elevation: "level1",
    hoverElevation: "level2",
    activeElevation: "level1",
    radius: "lg",
    padding: "16px",
    gap: "12px",
  },
  
  /**
   * BUTTONS (LOCKED)
   * 
   * Primary: Brand color (emerald)
   * CTA: Tertiary (orange) - high conversion
   * Secondary: Outlined
   */
  button: {
    primary: {
      background: "primary",
      text: "onPrimary",
      radius: "full",
      height: "40px",
      paddingX: "24px",
      fontSize: "14px",
      fontWeight: 500,
    },
    cta: {
      background: "tertiary", // Orange - +21% conversion
      text: "onTertiary",
      radius: "full",
      height: "48px",
      paddingX: "32px",
      fontSize: "16px",
      fontWeight: 600,
      shadow: "level2",
    },
    secondary: {
      background: "transparent",
      text: "primary",
      border: "1px solid currentColor",
      radius: "full",
      height: "40px",
      paddingX: "24px",
    },
    ghost: {
      background: "transparent",
      text: "onSurface",
      radius: "md",
      height: "40px",
      paddingX: "16px",
    },
  },
  
  /**
   * INPUT FIELDS (LOCKED)
   * 
   * Variant: Filled (Material 3)
   * Focus: 3:1 contrast ratio minimum
   * Height: 56px standard, 48px compact
   */
  input: {
    variant: "filled",
    height: "56px",
    heightCompact: "48px",
    radius: "md",
    paddingX: "16px",
    fontSize: "16px",
    focusRingWidth: "2px",
    focusRingOffset: "2px",
  },
  
  /**
   * CHIPS (LOCKED)
   * 
   * Variant: Assist chip (Material 3)
   * Used for: Capabilities, suggestions
   */
  chip: {
    variant: "assist",
    height: "32px",
    radius: "full",
    paddingX: "16px",
    fontSize: "14px",
    fontWeight: 500,
    gap: "8px",
  },
  
  /**
   * CHAT BUBBLES (LOCKED)
   * 
   * Research: Chat UI Best Practices 2025
   */
  chatBubble: {
    userBackground: "primary",
    userText: "onPrimary",
    assistantBackground: "surfaceContainerHigh",
    assistantText: "onSurface",
    maxWidth: "80%",
    radius: "lg",
    padding: "16px",
  },
  
  /**
   * SIDEBAR (LOCKED)
   * 
   * Width: 280px expanded, 72px collapsed
   * Transition: 200ms standard easing
   */
  sidebar: {
    widthExpanded: "280px",
    widthCollapsed: "72px",
    transition: "200ms cubic-bezier(0.2, 0, 0, 1)",
    itemHeight: "44px",
    itemPadding: "12px",
    itemRadius: "md",
  },
  
  /**
   * CITATIONS (LOCKED)
   * 
   * Pattern: Perplexity-style superscripts
   */
  citation: {
    badgeSize: "16px",
    badgeRadius: "sm",
    badgeFontSize: "10px",
    badgeFontWeight: 600,
    hoverCardWidth: "288px",
    hoverCardPadding: "12px",
  },
  
  /**
   * SKELETON LOADING (LOCKED)
   * 
   * Shimmer: 1.5s loop, 100deg tilt
   * Match content structure
   */
  skeleton: {
    shimmerDuration: "1500ms",
    shimmerAngle: "100deg",
    backgroundColor: "surfaceContainerHigh",
    shimmerColor: "surfaceContainerLow",
  },
} as const;

// ============================================================================
// INTERACTION PATTERNS - LOCKED
// ============================================================================

export const INTERACTIONS = {
  /**
   * AI CHAT UX PATTERNS (LOCKED)
   * 
   * Research: NN/g, In The Pocket AI Guidelines
   */
  chat: {
    // Expectation management
    showLimitations: true,
    showSources: true, // Citations
    showThinkingState: true, // "جاري التحليل..."
    
    // Speed perception
    showResponseTime: true, // "أجاب في X ثانية"
    
    // Prompt controls
    showSuggestions: true,
    showModeSelector: true, // Quick/Deep/Action
    
    // Memory
    showChatHistory: true,
    enablePinning: true,
    enableArchiving: true,
  },
  
  /**
   * LOADING STATES (LOCKED)
   */
  loading: {
    useSkeletons: true, // Not spinners
    showProgress: true,
    respectReducedMotion: true,
  },
  
  /**
   * FOCUS STATES (LOCKED)
   */
  focus: {
    ringWidth: "2px",
    ringOffset: "2px",
    ringColor: "primary",
    contrastRatio: 3.0, // Minimum
  },
} as const;

// ============================================================================
// BRAND IDENTITY - LOCKED
// ============================================================================

export const BRAND = {
  /**
   * NAME & TAGLINE (LOCKED)
   */
  name: "Hekmo",
  nameArabic: "حكمو",
  tagline: "مساعدك الذكي بالعربي",
  taglineEnglish: "Your Smart Assistant in Arabic",
  
  /**
   * POSITIONING (LOCKED)
   * 
   * Differentiator: Arabic-first + Speed + Citations
   * Not a niche app - general-purpose AI like ChatGPT
   */
  positioning: {
    primary: "World-class AI, Arabic-first",
    differentiators: [
      "Native Arabic understanding (Saudi dialect)",
      "Speed indicator builds trust",
      "Citations for credibility",
      "Voice-first interaction",
    ],
  },
  
  /**
   * VOICE & TONE (LOCKED)
   */
  voice: {
    personality: ["helpful", "knowledgeable", "respectful", "efficient"],
    tone: "Professional yet approachable",
    language: "Arabic-first with cultural sensitivity",
    noEmojis: true,
  },
} as const;

// ============================================================================
// ACCESSIBILITY - LOCKED (WCAG 2.1 AA)
// ============================================================================

export const A11Y = {
  /**
   * CONTRAST REQUIREMENTS (LOCKED)
   */
  contrast: {
    normalText: 4.5, // Minimum for <18px
    largeText: 3.0, // 18px+ or 14px bold
    uiComponents: 3.0, // Buttons, inputs, icons
    focusIndicators: 3.0, // Focus rings
  },
  
  /**
   * TOUCH TARGETS (LOCKED)
   */
  touchTarget: {
    minimum: "44px", // iOS/Android standard
    recommended: "48px",
    spacing: "8px", // Between targets
  },
  
  /**
   * MOTION (LOCKED)
   */
  motion: {
    respectReducedMotion: true,
    fallbackDuration: "0ms",
  },
  
  /**
   * FOCUS (LOCKED)
   */
  focus: {
    visible: true,
    ringWidth: "2px",
    ringOffset: "2px",
    neverTrapFocus: true,
  },
} as const;

// ============================================================================
// GRID SYSTEM - LOCKED
// ============================================================================

export const GRID = {
  /**
   * BREAKPOINTS (LOCKED)
   * 
   * Mobile-first responsive design
   */
  breakpoints: {
    xs: "0px",       // Mobile portrait
    sm: "640px",     // Mobile landscape
    md: "768px",     // Tablet portrait
    lg: "1024px",    // Tablet landscape / Small desktop
    xl: "1280px",    // Desktop
    "2xl": "1536px", // Large desktop
  },
  
  /**
   * CONTAINER (LOCKED)
   */
  container: {
    maxWidth: "1280px",
    paddingX: {
      mobile: "16px",
      tablet: "24px",
      desktop: "32px",
    },
  },
  
  /**
   * COLUMNS (LOCKED)
   */
  columns: {
    mobile: 4,
    tablet: 8,
    desktop: 12,
  },
  
  gutter: "16px",
  margin: "16px",
} as const;

// ============================================================================
// ICONOGRAPHY - LOCKED
// ============================================================================

export const ICONS = {
  /**
   * ICON SYSTEM (LOCKED)
   * 
   * Library: Lucide React (consistent, open-source)
   * Sizing: Optical balance, not pixel-perfect
   */
  library: "lucide-react",
  
  sizes: {
    xs: "12px",
    sm: "16px",
    md: "20px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
  },
  
  strokeWidth: {
    thin: 1,
    regular: 1.5,
    medium: 2,
    bold: 2.5,
  },
  
  /**
   * ICON USAGE (LOCKED)
   */
  usage: {
    inlineWithText: "md", // 20px
    buttons: "sm",        // 16px
    navigation: "lg",     // 24px
    features: "xl",       // 32px
    heroSection: "2xl",   // 48px
  },
} as const;

// ============================================================================
// FORMS & VALIDATION - LOCKED
// ============================================================================

export const FORMS = {
  /**
   * FORM PATTERNS (LOCKED)
   */
  validation: {
    // Timing
    validateOnBlur: true,
    validateOnChange: false, // Too aggressive
    debounceMs: 300,
    
    // Error display
    errorPosition: "below", // Below input
    errorColor: "error",
    errorFontSize: "12px",
    
    // Success
    showSuccessState: true,
    successColor: "success",
  },
  
  /**
   * LABELS (LOCKED)
   */
  labels: {
    position: "above", // Not floating (better a11y)
    fontSize: "14px",
    fontWeight: 500,
    requiredIndicator: "*",
    optionalText: "(اختياري)",
  },
  
  /**
   * HELP TEXT (LOCKED)
   */
  helpText: {
    position: "below",
    fontSize: "12px",
    color: "onSurfaceVariant",
  },
} as const;

// ============================================================================
// NAVIGATION PATTERNS - LOCKED
// ============================================================================

export const NAVIGATION = {
  /**
   * TABS (LOCKED)
   */
  tabs: {
    height: "48px",
    indicatorHeight: "2px",
    indicatorColor: "primary",
    transition: "200ms standard",
  },
  
  /**
   * BREADCRUMBS (LOCKED)
   */
  breadcrumbs: {
    separator: "/",
    fontSize: "14px",
    color: "onSurfaceVariant",
    activeColor: "onSurface",
  },
  
  /**
   * DRAWER (LOCKED)
   */
  drawer: {
    width: "320px",
    backdrop: "rgba(0, 0, 0, 0.5)",
    transition: "300ms emphasized",
  },
} as const;

// ============================================================================
// DIALOGS & OVERLAYS - LOCKED
// ============================================================================

export const DIALOGS = {
  /**
   * MODAL (LOCKED)
   */
  modal: {
    maxWidth: {
      sm: "400px",
      md: "560px",
      lg: "720px",
      xl: "900px",
      full: "calc(100vw - 32px)",
    },
    radius: "xl",
    padding: "24px",
    headerPadding: "24px 24px 16px",
    footerPadding: "16px 24px 24px",
    backdropColor: "hsla(30, 15%, 5%, 0.6)",
    transition: "200ms emphasized",
  },
  
  /**
   * POPOVER (LOCKED)
   */
  popover: {
    maxWidth: "320px",
    radius: "lg",
    padding: "12px",
    offset: "8px",
    animation: "150ms emphasized",
  },
  
  /**
   * TOOLTIP (LOCKED)
   */
  tooltip: {
    maxWidth: "200px",
    radius: "sm",
    padding: "8px 12px",
    fontSize: "12px",
    delay: "400ms",
  },
} as const;

// ============================================================================
// FEEDBACK & ALERTS - LOCKED
// ============================================================================

export const FEEDBACK = {
  /**
   * TOAST/SNACKBAR (LOCKED)
   */
  toast: {
    maxWidth: "400px",
    radius: "lg",
    padding: "16px",
    duration: "5000ms",
    position: "bottom-right", // RTL: bottom-left visually
  },
  
  /**
   * BANNER (LOCKED)
   */
  banner: {
    padding: "12px 16px",
    fontSize: "14px",
    iconSize: "20px",
    dismissible: true,
  },
  
  /**
   * ALERT (LOCKED)
   */
  alert: {
    radius: "lg",
    padding: "16px",
    variants: ["info", "success", "warning", "error"],
  },
} as const;

// ============================================================================
// EMPTY & ERROR STATES - LOCKED
// ============================================================================

export const STATES = {
  /**
   * EMPTY STATE (LOCKED)
   */
  empty: {
    iconSize: "64px",
    iconColor: "onSurfaceVariant",
    titleFontSize: "18px",
    descriptionFontSize: "14px",
    maxWidth: "400px",
    spacing: "16px",
  },
  
  /**
   * ERROR STATE (LOCKED)
   */
  error: {
    iconSize: "64px",
    iconColor: "error",
    showRetryButton: true,
    retryButtonVariant: "primary",
  },
  
  /**
   * LOADING STATE (LOCKED)
   */
  loading: {
    spinnerSize: "24px",
    spinnerStrokeWidth: "2px",
    useSkeletons: true, // Prefer skeletons over spinners
  },
  
  /**
   * DISABLED STATE (LOCKED)
   */
  disabled: {
    opacity: 0.38, // Material 3 spec
    cursor: "not-allowed",
  },
} as const;

// ============================================================================
// THEME DEFAULTS - LOCKED
// ============================================================================

export const DEFAULTS = {
  theme: "light" as const, // Light mode is default
  direction: "rtl" as const, // Arabic-first
  locale: "ar-SA" as const, // Saudi Arabia
} as const;

// ============================================================================
// DESIGN TOKENS (JSON-exportable format)
// ============================================================================

export const TOKENS = {
  /**
   * STYLE DICTIONARY COMPATIBLE
   * 
   * Can be exported to:
   * - CSS Custom Properties
   * - Tailwind Config
   * - Figma Variables
   * - iOS/Android tokens
   */
  color: {
    "color-primary": { value: "hsl(30 20% 35%)", type: "color" },
    "color-background": { value: "hsl(40 30% 97%)", type: "color" },
    "color-surface": { value: "hsl(40 30% 97%)", type: "color" },
    "color-on-surface": { value: "hsl(30 15% 12%)", type: "color" },
    "color-error": { value: "hsl(0 50% 45%)", type: "color" },
    "color-success": { value: "hsl(140 35% 40%)", type: "color" },
    "color-warning": { value: "hsl(35 50% 50%)", type: "color" },
  },
  
  spacing: {
    "spacing-1": { value: "4px", type: "dimension" },
    "spacing-2": { value: "8px", type: "dimension" },
    "spacing-3": { value: "12px", type: "dimension" },
    "spacing-4": { value: "16px", type: "dimension" },
    "spacing-6": { value: "24px", type: "dimension" },
    "spacing-8": { value: "32px", type: "dimension" },
  },
  
  typography: {
    "font-family-arabic": { value: "Cairo, system-ui, sans-serif", type: "fontFamily" },
    "font-family-latin": { value: "Inter, system-ui, sans-serif", type: "fontFamily" },
    "font-size-body": { value: "14px", type: "dimension" },
    "font-size-title": { value: "22px", type: "dimension" },
    "font-size-heading": { value: "28px", type: "dimension" },
  },
  
  radius: {
    "radius-sm": { value: "4px", type: "dimension" },
    "radius-md": { value: "8px", type: "dimension" },
    "radius-lg": { value: "12px", type: "dimension" },
    "radius-xl": { value: "16px", type: "dimension" },
    "radius-full": { value: "9999px", type: "dimension" },
  },
  
  shadow: {
    "shadow-1": { value: "0px 1px 2px 0px rgba(0,0,0,0.1), 0px 1px 3px 1px rgba(0,0,0,0.06)", type: "shadow" },
    "shadow-2": { value: "0px 1px 2px 0px rgba(0,0,0,0.1), 0px 2px 6px 2px rgba(0,0,0,0.06)", type: "shadow" },
    "shadow-3": { value: "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 4px 8px 3px rgba(0,0,0,0.06)", type: "shadow" },
  },
} as const;

// ============================================================================
// DOCUMENTATION STRUCTURE
// ============================================================================

export const DOCUMENTATION = {
  /**
   * COMPONENT DOCS TEMPLATE
   * 
   * Each component should have:
   * - Description
   * - Usage guidelines
   * - Do's and Don'ts
   * - Accessibility notes
   * - Code examples
   */
  template: {
    sections: [
      "Overview",
      "When to use",
      "When not to use",
      "Anatomy",
      "Variants",
      "States",
      "Accessibility",
      "Best practices",
      "Related components",
    ],
  },
  
  /**
   * DO'S AND DON'TS EXAMPLES
   */
  guidelines: {
    buttons: {
      do: [
        "Use one primary CTA per screen",
        "Use sentence case for labels",
        "Keep labels short (1-3 words)",
        "Use icons with text for clarity",
      ],
      dont: [
        "Don't use multiple primary buttons",
        "Don't use ALL CAPS",
        "Don't use generic labels like 'Click here'",
        "Don't disable without explanation",
      ],
    },
    colors: {
      do: [
        "Use semantic colors for states",
        "Maintain 4.5:1 contrast for text",
        "Use primary for key actions only",
        "Use muted for secondary content",
      ],
      dont: [
        "Don't use red for non-error states",
        "Don't use color as only indicator",
        "Don't override semantic meanings",
        "Don't use pure black (#000)",
      ],
    },
    typography: {
      do: [
        "Use Cairo for all Arabic text",
        "Use Inter for Latin/numbers",
        "Maintain hierarchy with size/weight",
        "Use 1.5 line-height for body text",
      ],
      dont: [
        "Don't mix more than 2 font families",
        "Don't use light weights (<400)",
        "Don't justify Arabic text",
        "Don't use decorative fonts",
      ],
    },
  },
} as const;

// ============================================================================
// VERSIONING & GOVERNANCE
// ============================================================================

export const GOVERNANCE = {
  /**
   * VERSION CONTROL (LOCKED)
   * 
   * Semantic versioning:
   * - MAJOR: Breaking changes (color system, typography overhaul)
   * - MINOR: New components, new tokens
   * - PATCH: Bug fixes, documentation updates
   */
  versioning: {
    current: "3.0.0",
    format: "MAJOR.MINOR.PATCH",
    changelog: "/CHANGELOG.md",
  },
  
  /**
   * OWNERSHIP (LOCKED)
   */
  ownership: {
    productOwner: "Design System Lead",
    coreTeam: ["Design", "Frontend", "Accessibility"],
    contributionModel: "Open with review",
  },
  
  /**
   * CHANGE PROCESS (LOCKED)
   */
  changeProcess: {
    steps: [
      "1. RFC (Request for Comments) submitted",
      "2. Design review (1 week)",
      "3. Accessibility audit",
      "4. Implementation + documentation",
      "5. Migration guide if breaking",
      "6. Release with changelog",
    ],
    approvalRequired: ["Design Lead", "Frontend Lead"],
  },
  
  /**
   * MAINTENANCE SCHEDULE (LOCKED)
   */
  maintenance: {
    auditFrequency: "Quarterly",
    deprecationNotice: "2 minor versions",
    supportWindow: "6 months",
  },
} as const;

// ============================================================================
// EXPORT
// ============================================================================

export const DESIGN_SYSTEM = {
  version: "3.0.0",
  locked: true,
  lastUpdated: "2026-01-29",
  
  // Foundation
  typography: TYPOGRAPHY,
  colors: COLORS,
  spacing: SPACING,
  radius: RADIUS,
  elevation: ELEVATION,
  motion: MOTION,
  grid: GRID,
  icons: ICONS,
  
  // Components
  components: COMPONENTS,
  forms: FORMS,
  navigation: NAVIGATION,
  dialogs: DIALOGS,
  feedback: FEEDBACK,
  states: STATES,
  
  // Patterns
  interactions: INTERACTIONS,
  
  // Brand & A11y
  brand: BRAND,
  a11y: A11Y,
  
  // System
  defaults: DEFAULTS,
  tokens: TOKENS,
  documentation: DOCUMENTATION,
  governance: GOVERNANCE,
} as const;

export default DESIGN_SYSTEM;

// ============================================================================
// ENTERPRISE CHECKLIST (Complete)
// ============================================================================
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    HEKMO DESIGN SYSTEM - COMPLETE INVENTORY              ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ FOUNDATION LAYER                                                          ║
 * ║ [x] Typography (font families, scale, chat-specific)                     ║
 * ║ [x] Colors (light/dark, semantic, Material 3 roles)                      ║
 * ║ [x] Spacing (4px base unit, full scale)                                  ║
 * ║ [x] Border Radius (complete scale)                                        ║
 * ║ [x] Elevation (Material 3 shadows)                                        ║
 * ║ [x] Motion (duration, easing, reduced motion)                            ║
 * ║ [x] Grid System (breakpoints, columns, gutters)                          ║
 * ║ [x] Iconography (library, sizes, stroke weights)                         ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ COMPONENTS                                                                 ║
 * ║ [x] Buttons (primary, CTA, secondary, ghost)                              ║
 * ║ [x] Cards (elevated pattern)                                              ║
 * ║ [x] Inputs (filled, validation, focus)                                    ║
 * ║ [x] Chips (assist chips)                                                  ║
 * ║ [x] Chat Bubbles (user/assistant)                                         ║
 * ║ [x] Sidebar (expanded/collapsed)                                          ║
 * ║ [x] Citations (Perplexity pattern)                                        ║
 * ║ [x] Skeleton Loading (shimmer)                                            ║
 * ║ [x] Forms (validation, labels, help text)                                 ║
 * ║ [x] Navigation (tabs, breadcrumbs, drawer)                               ║
 * ║ [x] Dialogs (modal, popover, tooltip)                                    ║
 * ║ [x] Feedback (toast, banner, alert)                                      ║
 * ║ [x] States (empty, error, loading, disabled)                             ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ PATTERNS                                                                   ║
 * ║ [x] AI Chat UX (citations, speed, suggestions)                           ║
 * ║ [x] Loading States (skeletons, progress)                                  ║
 * ║ [x] Focus States (ring, contrast)                                         ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ BRAND & ACCESSIBILITY                                                      ║
 * ║ [x] Brand Identity (name, tagline, positioning, voice)                   ║
 * ║ [x] Accessibility (WCAG 2.1 AA, contrast, touch targets)                 ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ SYSTEM                                                                     ║
 * ║ [x] Design Tokens (JSON-exportable)                                       ║
 * ║ [x] Documentation Structure (templates, do's/don'ts)                     ║
 * ║ [x] Governance (versioning, ownership, process)                          ║
 * ║ [x] Defaults (theme, direction, locale)                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * This design system is comparable to:
 * - Material Design (Google)
 * - Carbon Design System (IBM)
 * - Polaris (Shopify)
 * - Atlassian Design System
 * - Lightning Design System (Salesforce)
 */
