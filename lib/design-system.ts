/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    HEKMO DESIGN SYSTEM - LOCKED v2.0                      ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║ Enterprise-level design tokens based on deep research.                    ║
 * ║ All decisions are FINAL and must be followed consistently.                ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * RESEARCH SOURCES:
 * - Material Design 3 (m3.material.io) - Color, elevation, motion
 * - Arabic Font Comparison 2025 - Cairo rated 10/10 readability
 * - CTA Color A/B Testing (2,588 tests) - Blue 31%, Orange +32%
 * - NN/g & In The Pocket AI Guidelines - Interaction patterns
 * - Carbon Design System - Spacing tokens
 * - Chat UI Design Patterns 2025 - Message bubble specs
 * 
 * @version 2.0.0
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
// COLOR SYSTEM - LOCKED (Material 3 + Research)
// ============================================================================

export const COLORS = {
  /**
   * BRAND COLOR DECISION (LOCKED)
   * 
   * Primary: Emerald Green (HSL 160)
   * - Conveys: Growth, renewal, sophistication, trust
   * - Differentiates from typical blue tech (38% of tech uses blue)
   * - "Expensive energy" - modern luxury positioning
   * - Natural connection: Sustainable, organic values
   * 
   * CTA/Tertiary: Orange (#ff7900)
   * - Research: Orange CTAs = +32% conversion rate
   * - Red outperforms green by 5-34% in A/B tests
   * - Orange sparks enthusiasm and action
   * - Contrast: High visibility against emerald
   */
  
  light: {
    // Primary (Emerald) - Main brand color
    primary: "hsl(160 84% 39%)",           // #10b981
    onPrimary: "hsl(0 0% 100%)",
    primaryContainer: "hsl(160 100% 90%)",
    onPrimaryContainer: "hsl(160 100% 10%)",
    
    // Secondary - De-emphasized elements
    secondary: "hsl(160 30% 40%)",
    onSecondary: "hsl(0 0% 100%)",
    secondaryContainer: "hsl(160 50% 90%)",
    onSecondaryContainer: "hsl(160 30% 10%)",
    
    // Tertiary (Orange CTA) - High-conversion actions
    // Source: 2,588 A/B tests show orange/red +21-34%
    tertiary: "hsl(27 100% 50%)",          // #ff7900
    onTertiary: "hsl(0 0% 100%)",
    tertiaryContainer: "hsl(27 100% 90%)",
    onTertiaryContainer: "hsl(27 100% 10%)",
    
    // Error - Critical states
    error: "hsl(0 75% 42%)",
    onError: "hsl(0 0% 100%)",
    errorContainer: "hsl(0 100% 92%)",
    onErrorContainer: "hsl(0 100% 10%)",
    
    // Surface (Material 3 - Tone 98 for light)
    surface: "hsl(160 20% 98%)",
    onSurface: "hsl(160 10% 10%)",
    surfaceVariant: "hsl(160 20% 92%)",
    onSurfaceVariant: "hsl(160 10% 35%)",  // Increased contrast
    surfaceContainerLowest: "hsl(0 0% 100%)",
    surfaceContainerLow: "hsl(160 20% 96%)",
    surfaceContainer: "hsl(160 20% 94%)",
    surfaceContainerHigh: "hsl(160 20% 92%)",
    surfaceContainerHighest: "hsl(160 20% 90%)",
    
    // Outline
    outline: "hsl(160 10% 50%)",
    outlineVariant: "hsl(160 20% 80%)",
    
    // Background
    background: "hsl(160 20% 98%)",
    onBackground: "hsl(160 10% 10%)",
    
    // Inverse
    inverseSurface: "hsl(160 10% 20%)",
    inverseOnSurface: "hsl(160 20% 95%)",
    inversePrimary: "hsl(160 70% 70%)",
    
    // Shadows
    shadow: "hsl(0 0% 0%)",
    scrim: "hsl(0 0% 0%)",
  },
  
  dark: {
    // Dark mode for users who prefer it
    primary: "hsl(160 70% 65%)",
    onPrimary: "hsl(160 100% 10%)",
    primaryContainer: "hsl(160 80% 25%)",
    onPrimaryContainer: "hsl(160 100% 90%)",
    
    secondary: "hsl(160 40% 70%)",
    onSecondary: "hsl(160 30% 10%)",
    secondaryContainer: "hsl(160 30% 25%)",
    onSecondaryContainer: "hsl(160 50% 90%)",
    
    tertiary: "hsl(27 100% 60%)",
    onTertiary: "hsl(27 100% 10%)",
    tertiaryContainer: "hsl(27 80% 25%)",
    onTertiaryContainer: "hsl(27 100% 90%)",
    
    error: "hsl(0 80% 70%)",
    onError: "hsl(0 100% 10%)",
    errorContainer: "hsl(0 60% 25%)",
    onErrorContainer: "hsl(0 100% 90%)",
    
    surface: "hsl(160 15% 6%)",
    onSurface: "hsl(160 10% 90%)",
    surfaceVariant: "hsl(160 10% 15%)",
    onSurfaceVariant: "hsl(160 10% 70%)",
    surfaceContainerLowest: "hsl(160 15% 4%)",
    surfaceContainerLow: "hsl(160 12% 8%)",
    surfaceContainer: "hsl(160 10% 12%)",
    surfaceContainerHigh: "hsl(160 8% 15%)",
    surfaceContainerHighest: "hsl(160 6% 18%)",
    
    outline: "hsl(160 10% 50%)",
    outlineVariant: "hsl(160 10% 25%)",
    
    background: "hsl(160 15% 6%)",
    onBackground: "hsl(160 10% 90%)",
    
    inverseSurface: "hsl(160 20% 90%)",
    inverseOnSurface: "hsl(160 10% 20%)",
    inversePrimary: "hsl(160 84% 39%)",
    
    shadow: "hsl(0 0% 0%)",
    scrim: "hsl(0 0% 0%)",
  },
  
  /**
   * SEMANTIC COLORS (LOCKED)
   */
  semantic: {
    success: "hsl(142 76% 36%)",      // Green
    warning: "hsl(38 92% 50%)",       // Amber
    info: "hsl(217 91% 60%)",         // Blue
    
    // Citation badge
    citationBg: "hsla(160, 84%, 39%, 0.15)",
    citationText: "hsl(160 84% 39%)",
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
