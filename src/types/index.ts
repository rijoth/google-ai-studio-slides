// Purpose: Shared TypeScript types for presentation application
// Responsibilities: Define data structures for slides, settings, API responses
// Public interfaces: Slide, Presentation, Settings, ImageSlot, ApiResponse
// Dependencies: None
// Related files: server/storage/db.ts, src/store/*, src/components/*

export interface ImageSlot {
  name: string;
  label: string;
  description?: string;
}

export interface SlideContentBlock {
  type: 'eyebrow' | 'title' | 'lede' | 'sub' | 'rule' | 'html';
  value?: string;
  html?: string;
  className?: string;
}

export interface CardItem {
  icon?: string;
  iconClass?: string;
  title: string;
  body: string;
  borderColor?: string;
}

export interface TimelineItem {
  dot: number | string;
  dotBg: string;
  title: string;
  sub: string;
}

export interface ComparisonRow {
  label: string;
  values: string[];
}

export interface PipelineNode {
  num: number | string;
  bg: string;
  label: string;
  borderColor: string;
}

export interface BeforeAfter {
  badLabel: string;
  badText: string;
  goodLabel: string;
  goodText: string;
}

export interface ClosingCard {
  icon: string;
  title: string;
  body: string;
  url?: string;
}

export interface QRCode {
  label: string;
}

export interface InteractiveBlock {
  type: string;
  bgClass: string;
  label: string;
  question: string;
}

export interface Slide {
  id: string;
  part: number;
  slideType: 'hero' | 'content' | 'divider' | 'hero-alt';
  background?: string;
  blob?: 'b1' | 'b2' | 'both';
  eyebrow?: string;
  eyebrowClass?: string;
  title?: string;
  titleMark?: { text: string; cls: string };
  lede?: string;
  sub?: string;
  rule?: boolean;
  chipRow?: string[];
  footMeta?: { left: string; right: string };
  dividerNum?: string;
  dividerBgClass?: string;
  cols?: {
    left?: SlideColumnContent;
    right?: SlideColumnContent;
  };
  featureGrid?: { cols: number; items: CardItem[] };
  timeline?: TimelineItem[];
  pipeline?: { nodes: PipelineNode[]; direction?: 'horizontal' | 'vertical' };
  comparisonTable?: { headers: string[]; rows: ComparisonRow[] };
  beforeAfter?: BeforeAfter;
  interactive?: InteractiveBlock;
  bullets?: { style?: string; items: string[] };
  codeBlock?: string;
  resourceLinks?: { icon: string; label: string; url: string }[];
  qrCode?: boolean;
  closingCards?: ClosingCard[];
  qrCodeBlock?: QRCode;
  imageSlots: ImageSlot[];
  images: Record<string, string>;
  speakerNotes?: string;
}

export interface SlideColumnContent {
  bullets?: { style?: string; items: string[] };
  features?: CardItem[];
  cards?: { title: string; body: string; titleColor?: string; borderColor?: string }[];
  codeBlock?: string;
  imageSlots?: ImageSlot[];
  interactive?: InteractiveBlock;
  callout?: { text: string; borderColor: string };
}

export interface Presentation {
  title: string;
  instructor: string;
  course: string;
  date: string;
  slides: Slide[];
}

export interface Settings {
  presentationTitle: string;
  instructorName: string;
  courseName: string;
  date: string;
  theme: 'material3' | 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  cornerRadius: number;
  shadowLevel: number;
  spacing: number;
  transition: 'fade' | 'slide' | 'zoom';
  showSpeakerNotes: boolean;
  fullscreenOnStart: boolean;
  autoSave: boolean;
  speakerTimer: boolean;
  enableKeyboardShortcuts: boolean;
  enableAnimations: boolean;
  imageCompressionLevel: number;
  logo?: string;
  accentColor?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  path: string;
  thumbnail: string;
  filename: string;
}

export interface ImageInfo {
  filename: string;
  path: string;
  thumbnail: string;
  size: number;
  uploadedAt: string;
  usedBy: string[];
}
