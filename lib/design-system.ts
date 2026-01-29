/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    HEKMO DESIGN SYSTEM - LOCKED v3.0                      ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ VISION: Minimal colors, warm stone vibes, Apple + ChatGPT feel            ║
 * ║ Enterprise-level design tokens based on deep research.                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * DESIGN DIRECTION:
 * - Minimal, not vibrant
 * - Warm stone/beige tones
 * - Apple Liquid Glass elegance
 * - ChatGPT earth-tone warmth
 * - Premium, sophisticated, timeless
 * 
 * RESEARCH SOURCES:
 * - Apple Human Interface Guidelines 2025 - Liquid Glass
 * - ChatGPT UI Palettes - Warm neutrals
 * - Arabic Font Comparison 2025 - Cairo rated 10/10 readability
 * - Minimal UI Premium Palettes - Soft elegance
 * 
 * @version 3.0.0
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
// ELEVATION - LOCKED (Material 3)
// ============================================================================

export const ELEVATION = {
  /**
   * ELEVATION DECISION (LOCKED)
   * 
   * Use elevated cards for:
   * - Suggestion cards (+72% engagement)
   * - Dialogs/modals
   * - Dropdown menus
   * - Floating action buttons
   * 
   * Light mode uses tonal surfaces + shadows
   * Dark mode uses tonal surfaces only
   */
  level0: "none",
  level1: "0px 1px 2px 0px rgba(0,0,0,0.1), 0px 1px 3px 1px rgba(0,0,0,0.06)",
  level2: "0px 1px 2px 0px rgba(0,0,0,0.1), 0px 2px 6px 2px rgba(0,0,0,0.06)",
  level3: "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 4px 8px 3px rgba(0,0,0,0.06)",
  level4: "0px 2px 3px 0px rgba(0,0,0,0.1), 0px 6px 10px 4px rgba(0,0,0,0.06)",
  level5: "0px 4px 4px 0px rgba(0,0,0,0.1), 0px 8px 12px 6px rgba(0,0,0,0.06)",
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
// THEME DEFAULTS - LOCKED
// ============================================================================

export const DEFAULTS = {
  theme: "light" as const, // Light mode is default
  direction: "rtl" as const, // Arabic-first
  locale: "ar-SA" as const, // Saudi Arabia
} as const;

// ============================================================================
// EXPORT
// ============================================================================

export const DESIGN_SYSTEM = {
  version: "2.0.0",
  locked: true,
  lastUpdated: "2026-01-29",
  
  typography: TYPOGRAPHY,
  colors: COLORS,
  elevation: ELEVATION,
  motion: MOTION,
  spacing: SPACING,
  radius: RADIUS,
  components: COMPONENTS,
  interactions: INTERACTIONS,
  brand: BRAND,
  a11y: A11Y,
  defaults: DEFAULTS,
} as const;

export default DESIGN_SYSTEM;

// ============================================================================
// LOCK-IN CHECKLIST (for reference)
// ============================================================================
/**
 * LOCKED DECISIONS:
 * 
 * [x] Typography: Cairo for Arabic (10/10), Inter for Latin
 * [x] Primary Color: Emerald green (HSL 160)
 * [x] CTA Color: Orange (#ff7900) - +21% conversion
 * [x] Theme: Light mode default
 * [x] Cards: Elevated (not outlined/filled)
 * [x] Buttons: Full radius, 40-48px height
 * [x] Animation: 150-200ms desktop, standard easing
 * [x] Spacing: 4px base unit
 * [x] Border Radius: 12px default for cards
 * [x] Focus: 2px ring, primary color
 * [x] Touch Targets: 44px minimum
 * [x] Citations: Perplexity superscript pattern
 * [x] Speed Indicator: Show response time
 * [x] Voice: Orange CTA button
 * [x] Sidebar: 280px expanded, 72px collapsed
 * [x] Loading: Skeletons with shimmer
 * [x] Brand: Hekmo - Arabic-first AI
 */
