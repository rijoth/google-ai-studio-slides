// Purpose: JSON-file storage layer for presentation data
// Responsibilities: Read/write presentation.json and settings.json, provide defaults
// Public interfaces: getPresentation, savePresentation, getSettings, saveSettings, getImageLibrary
// Dependencies: fs/promises, path
// Related files: server/routes/*, src/store/*

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Presentation, Settings, ImageInfo, Slide } from '../../src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_DIR = path.resolve(__dirname, '../../storage');
const IMAGES_DIR = path.join(STORAGE_DIR, 'images');
const THUMBS_DIR = path.join(IMAGES_DIR, 'thumbs');
const PRESENTATION_PATH = path.join(STORAGE_DIR, 'presentation.json');
const SETTINGS_PATH = path.join(STORAGE_DIR, 'settings.json');

async function ensureDirs() {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  await fs.mkdir(THUMBS_DIR, { recursive: true });
}

export async function getPresentation(): Promise<Presentation> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(PRESENTATION_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const defaults = getDefaultPresentation();
    await savePresentation(defaults);
    return defaults;
  }
}

export async function savePresentation(data: Presentation): Promise<void> {
  await ensureDirs();
  await fs.writeFile(PRESENTATION_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getSettings(): Promise<Settings> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(SETTINGS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const defaults = getDefaultSettings();
    await saveSettings(defaults);
    return defaults;
  }
}

export async function saveSettings(data: Settings): Promise<void> {
  await ensureDirs();
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getImageLibrary(): Promise<ImageInfo[]> {
  await ensureDirs();
  const presentation = await getPresentation();
  const usedMap = new Map<string, string[]>();
  for (const slide of presentation.slides) {
    for (const [slot, imgPath] of Object.entries(slide.images)) {
      const fname = path.basename(imgPath);
      if (!usedMap.has(fname)) usedMap.set(fname, []);
      usedMap.get(fname)!.push(`Slide: ${slide.title} (${slot})`);
    }
  }

  try {
    const files = await fs.readdir(IMAGES_DIR);
    const imageFiles = files.filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f));
    const result: ImageInfo[] = [];
    for (const f of imageFiles) {
      const fpath = path.join(IMAGES_DIR, f);
      const stat = await fs.stat(fpath);
      result.push({
        filename: f,
        path: `/images/${f}`,
        thumbnail: `/images/thumbs/${f}`,
        size: stat.size,
        uploadedAt: stat.mtime.toISOString(),
        usedBy: usedMap.get(f) || [],
      });
    }
    return result;
  } catch {
    return [];
  }
}

export async function deleteImage(filename: string): Promise<boolean> {
  const imgPath = path.join(IMAGES_DIR, filename);
  const thumbPath = path.join(THUMBS_DIR, filename);
  let deleted = false;
  try { await fs.unlink(imgPath); deleted = true; } catch { /* */ }
  try { await fs.unlink(thumbPath); } catch { /* */ }
  return deleted;
}

export function getImagesDir(): string { return IMAGES_DIR; }
export function getThumbsDir(): string { return THUMBS_DIR; }

function getDefaultSettings(): Settings {
  return {
    presentationTitle: 'Building Apps with Google AI Studio & Antigravity',
    instructorName: '',
    courseName: 'College Workshop',
    date: '2026',
    theme: 'material3',
    primaryColor: '#4285F4',
    secondaryColor: '#A142F4',
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    cornerRadius: 22,
    shadowLevel: 2,
    spacing: 20,
    transition: 'fade',
    showSpeakerNotes: false,
    fullscreenOnStart: true,
    autoSave: true,
    speakerTimer: false,
    enableKeyboardShortcuts: true,
    enableAnimations: true,
    imageCompressionLevel: 80,
  };
}

function getDefaultPresentation(): Presentation {
  return {
    title: 'Building Apps with Google AI Studio & Antigravity',
    instructor: '',
    course: 'College Workshop',
    date: '2026',
    slides: buildSlides(),
  };
}

function buildSlides(): Slide[] {
  const s = (overrides: Partial<Slide>): Slide => ({
    id: '',
    part: 1,
    slideType: 'content',
    imageSlots: [],
    images: {},
    ...overrides,
  });

  return [
    s({ id: 'title', part: 1, slideType: 'hero', blob: 'both', eyebrow: 'A 50-minute hands-on workshop · Beginner friendly', eyebrowClass: 'white',
      title: 'Building Apps with<br><span class="mark" style="background-image:linear-gradient(120deg,#FBBC04,#fff,#34A853)">Google AI Studio</span><br>& <span class="mark" style="background-image:linear-gradient(120deg,#fff,#A142F4)">Antigravity</span>',
      lede: 'From idea to deployed app — by talking to AI. Learn how two Google tools turn plain English into running software.',
      chipRow: ['🚀 Vibe coding', '🧠 Prompt engineering', '☁️ Firebase + Cloud Run', '🤖 Agentic dev'],
      footMeta: { left: 'College Workshop · 2026', right: '💪 No experience required' } }),

    s({ id: 'agenda', part: 1, blob: 'both', eyebrow: 'Agenda',
      title: 'Our <span class="mark blue">50-minute</span> flight plan',
      timeline: [
        { dot: 1, dotBg: '#4285F4', title: 'Why AI?', sub: 'Vibe coding' },
        { dot: 2, dotBg: '#34A853', title: 'AI Studio', sub: 'Playground' },
        { dot: 3, dotBg: '#FBBC04', title: 'Prompts', sub: 'Live practice' },
        { dot: 4, dotBg: '#EA4335', title: 'Antigravity', sub: 'Agent dev' },
        { dot: 5, dotBg: '#A142F4', title: 'Workflow', sub: 'Idea→Deploy' },
        { dot: 6, dotBg: '#00BCD4', title: 'Demo', sub: 'End to end' },
        { dot: 7, dotBg: '#D9458F', title: 'Best + Limits', sub: 'Reality check' },
        { dot: 8, dotBg: '#475569', title: 'Future', sub: 'Careers' },
      ],
      imageSlots: [{ name: 'agenda-illustration', label: 'Agenda roadmap illustration', description: 'Roadmap ribbon with numbered checkpoints; mountaintop "shipped app" icon at far right.' }] }),

    s({ id: 'why-ai', part: 1, blob: 'b1', eyebrow: 'Part 1 · Introduction',
      title: 'AI is <span class="mark warm">rewriting</span> how software is built', rule: true,
      cols: {
        left: { bullets: { items: ['Draft a feature in minutes, not weeks', 'Plain English becomes running code', 'Web apps without writing every line', 'Beginners ship real projects on day one', 'Focus on ideas, not syntax errors'] } },
        right: { imageSlots: [{ name: 'chart', label: 'AI adoption chart', description: 'Bar chart 2019→2026 showing rising line "time-to-prototype" dropping sharply; small robot+human handshake icon.' }], interactive: { type: 'Ask the Audience', bgClass: 'cool', label: '🙋 Ask the Audience', question: '"Who here has used an AI chatbot to help with code?"' } }
      } }),

    s({ id: 'vibe-coding', part: 1, blob: 'b2', eyebrow: 'Key idea',
      title: 'What is <span class="mark purple">vibe coding</span>?',
      lede: 'Describe the <em>vibe</em> of what you want. AI builds it. You steer, test, and improve.',
      featureGrid: { cols: 3, items: [
        { icon: '💬', iconClass: 'i-blue', title: 'Describe in words', body: '"Build a study planner with a dashboard."', borderColor: '#4285F4' },
        { icon: '⚙️', iconClass: 'i-green', title: 'AI generates code', body: 'UI, server logic, dependencies — all scaffolded.', borderColor: '#34A853' },
        { icon: '🔄', iconClass: 'i-yellow', title: 'Iterate the feel', body: '"Make it darker" "Add a chart" — refine by chatting.', borderColor: '#FBBC04' },
      ] },
      interactive: { type: 'Think · Pair · Share', bgClass: '', label: '🤔 Think · Pair · Share', question: '"What app would you build today if a robot helped?"' } }),

    s({ id: 'programmer-role', part: 1, blob: 'b1', eyebrow: 'Your changing role',
      title: 'You become the <span class="mark mint">director</span>, not the typist',
      cols: {
        left: { features: [{ icon: '', iconClass: '', title: 'OLD: typing', body: '', borderColor: '#EA4335' }], bullets: { style: 'sq', items: ['Memorize every syntax rule', 'Build from a blank file', 'Hunt bugs alone for hours', 'Read docs front to back'] } },
        right: { features: [{ icon: '', iconClass: '', title: 'NEW: steering', body: '', borderColor: '#34A853' }], bullets: { style: 'b5', items: ['Describe intent clearly', 'Review & verify AI output', 'Guide architecture decisions', 'Learn fundamentals alongside AI'] } }
      },
      imageSlots: [{ name: 'role-illustration', label: 'Role shift illustration', description: 'Split human figure — left hand typing, right hand pointing at glowing screen; small "fundamentals" foundation slab underneath.' }] }),

    s({ id: 'divider-p2', part: 2, slideType: 'divider', dividerBgClass: 'div-bg1', dividerNum: '02', eyebrow: 'Part 2', eyebrowClass: 'white',
      title: 'Google AI Studio',
      lede: 'The browser-based lab for Gemini — prototype, tune, and ship apps without installing anything.' }),

    s({ id: 'what-is-ai-studio', part: 2, eyebrow: '',
      title: 'What is Google <span class="mark blue">AI Studio</span>?',
      lede: 'The "developer\'s playground" for Gemini — raw access to model settings, in a web lab. No PhD required, all point-and-click.',
      cols: {
        left: { bullets: { items: ['Web app — nothing to install', 'Sign in with a Google account', 'Tune every model parameter', 'Generate code in many languages', 'Build full apps from a description'] } },
        right: { imageSlots: [{ name: 'ai-studio-home', label: 'AI Studio home screenshot', description: 'AI Studio home at aistudio.google.com with sidebar "Run settings" expanded.' }], interactive: { type: 'Flash fact', bgClass: 'mint', label: 'Flash fact', question: 'It\'s a <strong>lab</strong>, not a chatbot — you control the knobs.' } }
      } }),

    s({ id: 'playground', part: 2, eyebrow: 'Start here',
      title: 'The <span class="mark blue">Playground</span>',
      lede: 'Opens by default with a fresh <strong>chat prompt</strong>. Type, click <em>Run</em>, see the model reply — then tune from the side panel.',
      cols: {
        left: { codeBlock: '# 1. Open aistudio.google.com\n# 2. Playground opens with a new chat prompt\n\nSystem Instructions:\n  You are an alien that lives on Europa.\n\nUser: What\'s the weather like?\n→ Run\n\nModel: Ah, a query about the flows and states\nupon Europa! You speak of "weather," yes? ...' },
        right: { imageSlots: [{ name: 'playground', label: 'Playground chat screenshot', description: 'Playground chat — left message thread, right Run settings panel collapsed.' }] }
      } }),

    s({ id: 'models', part: 2, eyebrow: 'Model selector',
      title: 'Choose the right <span class="mark blue">brain</span>',
      featureGrid: { cols: 4, items: [
        { icon: '✦', iconClass: 'i-blue', title: 'Gemini', body: 'Text, image, reasoning — default for most tasks.', borderColor: '#4285F4' },
        { icon: '🖼', iconClass: 'i-yellow', title: 'Imagen', body: 'Generate & edit images from prompts.', borderColor: '#FBBC04' },
        { icon: '🎬', iconClass: 'i-green', title: 'Veo', body: 'Text-to-video — cinematic clips.', borderColor: '#34A853' },
        { icon: '🗣', iconClass: 'i-purple', title: 'Live / Lyria', body: 'Speech, audio, music; realtime voice+vision.', borderColor: '#A142F4' },
      ] },
      sub: 'Older variants (Gemini 2.5, Gemini 2…) are also available. Paid models show a "Paid" tag.',
      imageSlots: [{ name: 'model-selector', label: 'Model Selector screenshot', description: 'Model Selector dropdown listing Gemini 3, Gemini 2.5 Pro, Veo, Imagen, Live models.' }] }),

    s({ id: 'tune-model', part: 2, eyebrow: 'Run settings',
      title: 'Tune your <span class="mark warm">model\'s behavior</span>',
      featureGrid: { cols: 3, items: [
        { icon: '🌡', iconClass: 'i-red', title: 'Temperature 0–2', body: 'Low = predictable & factual. High = creative & varied.', borderColor: '#EA4335' },
        { icon: '🧠', iconClass: 'i-purple', title: 'Thinking Level', body: 'Low = fast. Medium = balanced. High = deep reasoning (slower).', borderColor: '#A142F4' },
        { icon: '⏹', iconClass: 'i-blue', title: 'Stop Sequence', body: 'A string that makes the model halt — handy for filtering.', borderColor: '#4285F4' },
        { icon: '📏', iconClass: 'i-green', title: 'Output Length', body: 'Sets the max tokens — an upper limit, not a target.', borderColor: '#34A853' },
        { icon: '🛡', iconClass: 'i-yellow', title: 'Safety Settings', body: 'Tune filters for harassment, hate, explicit content.', borderColor: '#FBBC04' },
        { icon: '🔬', iconClass: 'i-cyan', title: 'Top-P', body: 'Nucleus sampling — controls word diversity.', borderColor: '#00BCD4' },
      ] } }),

    s({ id: 'smart-tools', part: 2, eyebrow: 'Tools panel',
      title: 'Give the model <span class="mark mint">real-world tools</span>',
      featureGrid: { cols: 3, items: [
        { icon: '🔎', iconClass: 'i-blue', title: 'Grounding: Search', body: 'Live Google Search — fetches current facts + citations.', borderColor: '#4285F4' },
        { icon: '🗺', iconClass: 'i-green', title: 'Grounding: Maps', body: 'Verify addresses, distances — geographic accuracy. (Search/Maps are exclusive.)', borderColor: '#34A853' },
        { icon: '🐍', iconClass: 'i-purple', title: 'Code Execution', body: 'Runs Python in a sandbox — math, sorting, charts.', borderColor: '#A142F4' },
        { icon: '📐', iconClass: 'i-red', title: 'Structured Outputs', body: 'Force JSON / schema — perfect for apps & parsers.', borderColor: '#EA4335' },
        { icon: '🌐', iconClass: 'i-yellow', title: 'URL Context', body: 'Ingest a live link as a primary data source.', borderColor: '#FBBC04' },
        { icon: '🎛', iconClass: 'i-cyan', title: 'Function Calling', body: 'Call your own code/tools from the model.', borderColor: '#00BCD4' },
      ] } }),

    s({ id: 'build-mode', part: 2, background: 'linear-gradient(135deg,#EEF2FF,#F0FDFA)', eyebrow: 'Build Mode · Vibe coding', eyebrowClass: '',
      title: 'Describe it → <span class="mark purple">it builds it</span>',
      lede: 'A full-stack environment: describe an idea and the model scaffolds the whole project.',
      pipeline: { direction: 'vertical', nodes: [
        { num: 1, bg: '#4285F4', label: 'Describe idea', borderColor: '#4285F4' },
        { num: 2, bg: '#A142F4', label: 'UI + server scaffold', borderColor: '#A142F4' },
        { num: 3, bg: '#34A853', label: 'Install npm packages', borderColor: '#34A853' },
        { num: 4, bg: '#FBBC04', label: 'Annotate UI changes', borderColor: '#FBBC04' },
        { num: 5, bg: '#00BCD4', label: 'Provision Firebase', borderColor: '#00BCD4' },
        { num: 6, bg: '#EA4335', label: 'Deploy to Cloud Run', borderColor: '#EA4335' },
      ] },
      sub: 'Default stack: <strong>React/Next.js</strong> frontend + <strong>Node.js</strong> backend. Annotation Mode lets you highlight UI and say "make this blue."' }),

    s({ id: 'compare-stream', part: 2, eyebrow: 'Three more modes',
      title: 'Compare · Stream · <span class="mark blue">Annotate</span>',
      featureGrid: { cols: 3, items: [
        { icon: '⚖️', iconClass: 'i-blue', title: 'Compare Mode', body: 'Send one prompt to several models or settings — A/B test cost & quality. Track token usage side-by-side.', borderColor: '#4285F4' },
        { icon: '📡', iconClass: 'i-green', title: 'Stream Mode', body: 'Realtime voice + vision + screen sharing. Show your screen; Gemini watches you code and points out errors.', borderColor: '#34A853' },
        { icon: '🖌', iconClass: 'i-yellow', title: 'Annotation Mode', body: 'Highlight any UI part and describe changes instead of hunting through files.', borderColor: '#FBBC04' },
      ] },
      imageSlots: [{ name: 'compare-mode', label: 'Compare Mode screenshot', description: 'Compare Mode showing two model responses side-by-side with token counts.' }] }),

    s({ id: 'export-deploy', part: 2, eyebrow: 'Ship it',
      title: 'Export code & <span class="mark blue">deploy</span> in clicks',
      cols: {
        left: { cards: [
          { title: '🧾 Get Code', body: 'Turns your prompt + response + settings into a code snippet. Languages: <strong>Python, Java, REST, TypeScript, .NET, Go</strong>.', titleColor: '#4285F4' },
          { title: '🔑 API Key', body: 'Link a paid Gemini API key for higher quotas & features.', titleColor: '#A142F4' },
        ] },
        right: { cards: [
          { title: '🔥 Firebase', body: 'Auto-provisions <strong>Firestore</strong> (database) + <strong>Firebase Auth</strong> ("Sign in with Google"). API keys stay secure via a proxy server.', titleColor: '#34A853' },
          { title: '☁️ Cloud Run', body: 'Deploy instantly to a public URL — hosting handled for you.', titleColor: '#EA4335' },
        ] }
      },
      imageSlots: [{ name: 'export-diagram', label: 'Export deploy diagram', description: 'AI Studio → [Get Code | Firebase | Cloud Run] → live public URL badge.' }] }),

    s({ id: 'workload-presets', part: 2, eyebrow: 'Workload presets',
      title: 'Combos beat <span class="mark warm">single tweaks</span>',
      comparisonTable: {
        headers: ['Workload', 'Temp', 'Top-P', 'Thinking', 'Best tool'],
        rows: [
          { label: 'Factchecking', values: ['0.1–0.3', '0.4', 'Medium', 'Search Grounding'] },
          { label: 'Creative writing', values: ['0.8–1.0', '0.9', 'Low', 'None (freedom)'] },
          { label: 'System debugging', values: ['0.0', '0.1', 'High', 'Code Execution'] },
          { label: 'Data extraction', values: ['0.0', '0.1', 'Low', 'Structured parsing'] },
        ] },
      sub: '⚠ Common error: <strong>fact-checking at high temperature</strong> — model prioritizes "sounding good" over being right.' }),

    s({ id: 'divider-p3', part: 3, slideType: 'divider', dividerBgClass: 'div-bg2', dividerNum: '03', eyebrow: 'Part 3', eyebrowClass: 'white',
      title: 'Live Prompt Engineering', lede: 'Better prompts = better apps. Let\'s practice together.' }),

    s({ id: 'good-bad-prompts', part: 3, eyebrow: '',
      title: 'Before → After: <span class="mark mint">prompt quality</span>',
      beforeAfter: { badLabel: '❌ Vague', badText: 'make a website', goodLabel: '✅ Specific', goodText: 'Build a React study-planner.\nBlue dashboard, calendar grid,\nadd-task form, save to local.\nMobile-friendly, clean UI.' },
      bullets: { items: ['Say what, for whom, and how it looks', 'Name the tech stack explicitly', 'One focused request per prompt'] },
      interactive: { type: 'Live Practice', bgClass: 'purple', label: 'Live Practice', question: 'Turn "make a game" into a 3-line strong prompt.' } }),

    s({ id: 'system-instructions', part: 3, eyebrow: 'From the official quickstart',
      title: 'System Instructions = <span class="mark blue">the rules of the game</span>',
      lede: 'A persistent, high-priority field that sets the persona for the whole session. Find it in <em>Run settings</em>.',
      cols: {
        left: { codeBlock: '# System Instructions field\nYou are Tim, an alien that lives\non Europa, one of Jupiter\'s moons.\nKeep answers under 3 paragraphs,\nuse an upbeat, chipper tone.\n\n# Chat prompts = suggestions\n# System Instructions = LAWS' },
        right: { imageSlots: [{ name: 'europa-chatbot', label: 'Europa chatbot screenshot', description: 'Europa chatbot — system instruction box + sample model reply in playful tone.' }], interactive: { type: 'Prediction', bgClass: 'cool', label: '⚡ Prediction', question: '"If Tim\'s tone were \'cold & robotic\', what changes?"' } }
      } }),

    s({ id: 'iterative-prompting', part: 3, eyebrow: 'Iterative prompting',
      title: 'Prompt → check → <span class="mark warm">refine</span>',
      pipeline: { direction: 'horizontal', nodes: [
        { num: 1, bg: '#4285F4', label: 'Write clear prompt', borderColor: '#4285F4' },
        { num: 2, bg: '#A142F4', label: 'Run & inspect output', borderColor: '#A142F4' },
        { num: 3, bg: '#FBBC04', label: 'Tweak + add detail', borderColor: '#FBBC04' },
        { num: 4, bg: '#34A853', label: 'Re-run → improve', borderColor: '#34A853' },
      ] },
      bullets: { items: ['Iterate — first try is rarely perfect', 'Small specific edits beat huge rewrites', 'Ask AI to explain its own code', 'Notice: long chats can hit token limits'] } }),

    s({ id: 'ask-ai', part: 3, eyebrow: 'One model, many moves',
      title: 'Ask AI to <span class="mark mint">debug · refactor · explain</span>',
      featureGrid: { cols: 4, items: [
        { icon: '🐞', iconClass: 'i-red', title: 'Debug', body: '"Here\'s my error — find the bug & fix it."', borderColor: '#EA4335' },
        { icon: '🔨', iconClass: 'i-blue', title: 'Refactor', body: '"Simplify this function, remove duplication."', borderColor: '#4285F4' },
        { icon: '📖', iconClass: 'i-green', title: 'Explain', body: '"Explain line-by-line like I\'m 12."', borderColor: '#34A853' },
        { icon: '➕', iconClass: 'i-purple', title: 'Add features', body: '"Add a search bar; filter by date."', borderColor: '#A142F4' },
      ] },
      interactive: { type: 'Quick Poll', bgClass: '', label: '💡 Quick Poll', question: '"Debug first or add features first — your call?"' } }),

    s({ id: 'divider-p4', part: 4, slideType: 'divider', dividerBgClass: 'div-bg3', dividerNum: '04', eyebrow: 'Part 4', eyebrowClass: 'white',
      title: 'Google Antigravity', lede: 'Project-aware, agentic development for the era of agents.' }),

    s({ id: 'chatbot-vs-antigravity', part: 4, eyebrow: 'Why another tool?',
      title: 'Chatbot vs <span class="mark purple">agent platform</span>',
      comparisonTable: {
        headers: ['Capability', 'Simple chatbot', 'Antigravity'],
        rows: [
          { label: 'Knows your codebase', values: ['❌ No', '✅ Project-aware'] },
          { label: 'Runs across folders', values: ['❌ Single paste', '✅ One or many folders'] },
          { label: 'Plans & gives proof', values: ['❌ Just answers', '✅ Artifacts'] },
          { label: 'Custom tools (MCP)', values: ['❌ Limited', '✅ One-click servers'] },
          { label: 'Runs on schedule', values: ['❌ No', '✅ /schedule tasks'] },
        ] } }),

    s({ id: 'ecosystem', part: 4, eyebrow: 'Antigravity 2.0 ecosystem',
      title: 'One <span class="mark purple">command center</span>, four surfaces',
      featureGrid: { cols: 4, items: [
        { icon: '🚀', iconClass: 'i-blue', title: 'Antigravity', body: 'Standalone app (macOS/Linux/Windows). Manage many local agents in parallel + scheduled tasks.', borderColor: '#4285F4' },
        { icon: '💻', iconClass: 'i-purple', title: 'Antigravity IDE', body: 'Original agentic IDE — agent manager, artifacts, deep codebase understanding. Recommended.', borderColor: '#A142F4' },
        { icon: '⌨️', iconClass: 'i-green', title: 'Antigravity CLI', body: 'Command-line agent interactions for terminal fans.', borderColor: '#34A853' },
        { icon: '🧩', iconClass: 'i-cyan', title: 'Antigravity SDK', body: 'Programmatically integrate Antigravity into your own systems.', borderColor: '#00BCD4' },
      ] } }),

    s({ id: 'projects-conversations', part: 4, eyebrow: 'Core concepts',
      title: 'Projects & <span class="mark blue">Conversations</span>',
      cols: {
        left: { cards: [{ title: '📁 Project', body: 'A combo of folders defining the agent\'s <strong>scope</strong>. One or many folders (e.g. front + back repo). Each project has isolated settings — security, tools, MCP.', titleColor: '#4285F4' }] },
        right: { cards: [{ title: '💬 Conversation', body: 'A named thread inside a project. Start many in parallel, rename them, revisit via <strong>Conversation History</strong>.', titleColor: '#34A853' }] }
      },
      imageSlots: [{ name: 'antigravity-sidebar', label: 'Antigravity sidebar screenshot', description: 'Antigravity sidebar — project with two conversation threads named conv-introduction, conv-sportsnews.' }] }),

    s({ id: 'project-settings', part: 4, eyebrow: 'Agent context',
      title: 'You control <span class="mark warm">what the agent may do</span>',
      featureGrid: { cols: 3, items: [
        { icon: '🔒', iconClass: 'i-red', title: 'Security Preset', body: 'Must terminal commands & file accesses be reviewed by you first?', borderColor: '#EA4335' },
        { icon: '🤖', iconClass: 'i-purple', title: 'Agent Behaviour', body: 'Executes the implementation plan with — or without — your review.', borderColor: '#A142F4' },
        { icon: '🛂', iconClass: 'i-blue', title: 'MCP Permissions', body: 'Per-project allow/block of paths, URLs, and MCP tools — keep context lean.', borderColor: '#4285F4' },
      ] },
      sub: 'All inherit from a global config; each project can override independently.' }),

    s({ id: 'slash-commands', part: 4, eyebrow: 'Slash commands',
      title: 'Type <span class="mark blue">/</span> to summon a superpower',
      cols: {
        left: { cards: [{ title: '/ browser', body: 'Launches a browser sub-agent. Ask it to navigate & debug a site. <strong>Requires Chrome as default browser</strong> — starts by asking your permission.', titleColor: '#4285F4' }] },
        right: { cards: [{ title: '/ schedule', body: 'Set recurring or one-off tasks — e.g. "9:00 AM Mon & Wed," or reminders every 20 min. Also via UI.', titleColor: '#34A853' }] }
      },
      imageSlots: [{ name: 'slash-menu', label: 'Slash command menu screenshot', description: 'Slash command menu listing /browser, /schedule and more.' }] }),

    s({ id: 'mcp-servers', part: 4, eyebrow: 'Model Context Protocol',
      title: 'MCP = the <span class="mark mint">plug</span> for external systems',
      cols: {
        left: { bullets: { style: 'b5', items: ['Standard way to connect agents to tools', 'Supports local & remote servers', 'One-click Google Cloud integrations', 'Add "Build & deploy a Cloud Run service"', 'Configure via mcp_config.json'] } },
        right: { callout: { text: '🔌 MCP Server → exposes tools → agent calls them → grounded in your real data.', borderColor: '#4285F4' } }
      },
      imageSlots: [{ name: 'mcp-diagram', label: 'MCP architecture diagram', description: 'Agent ↔ MCP Server ↔ External system (Cloud Run, Firestore, DB).' }] }),

    s({ id: 'skills', part: 4, eyebrow: 'Skills · progressive disclosure',
      title: 'Teach the agent <span class="mark purple">your standards</span>',
      lede: 'A skill sits dormant until your request matches its description — then loads, saving context & cost.',
      cols: {
        left: { codeBlock: '# SKILL.md (required)\n---\nname: code-review\ndescription: Reviews code for\n bugs, style, best practices.\n Use when reviewing PRs.\n---\n# instructions loaded only on match\nReview checklist:\n1. Correctness\n2. Edge cases\n3. Style / performance' },
        right: { cards: [
          { title: '🌐 Global scope', body: '<code>~/.gemini/config/skills/</code> — available across all Antigravity products & projects.', titleColor: '#00BCD4' },
          { title: '📦 Project scope', body: '<code>&lt;project&gt;/.agents/skills/</code> — only within one project.', titleColor: '#34A853' },
        ] }
      },
      sub: 'Anatomy: <code>SKILL.md</code> + optional <code>scripts/</code> <code>references/</code> <code>assets/</code>' }),

    s({ id: 'artifacts', part: 4, eyebrow: 'Artifacts · proof of work',
      title: 'Artifacts <span class="mark mint">solve the trust gap</span>',
      featureGrid: { cols: 3, items: [
        { icon: '📋', iconClass: 'i-blue', title: 'Task Lists', body: 'Structured plan before coding — review & comment to redirect.', borderColor: '#4285F4' },
        { icon: '📐', iconClass: 'i-purple', title: 'Implementation Plan', body: 'Architecture of changes — technical details for you to review.', borderColor: '#A142F4' },
        { icon: '🧭', iconClass: 'i-green', title: 'Walkthrough', body: 'After completion — summary of changes & how to test.', borderColor: '#34A853' },
        { icon: '🖋', iconClass: 'i-red', title: 'Code diffs', body: 'Line-by-line changes you can review & comment on.', borderColor: '#EA4335' },
        { icon: '📸', iconClass: 'i-yellow', title: 'Screenshots', body: 'UI captured before & after a change.', borderColor: '#FBBC04' },
        { icon: '🗂', iconClass: 'i-cyan', title: '+ Files', body: 'Generated source files viewable in the Auxiliary Pane.', borderColor: '#00BCD4' },
      ] } }),

    s({ id: 'workflow', part: 5, background: 'linear-gradient(160deg,#F0F4FF,#F0FDFA)', eyebrow: 'Part 5 · The full loop', eyebrowClass: '',
      title: 'The AI dev <span class="mark purple">workflow</span>',
      pipeline: { direction: 'vertical', nodes: [
        { num: '💡', bg: '#4285F4', label: 'Idea', borderColor: '#4285F4' },
        { num: '💬', bg: '#A142F4', label: 'Prompt', borderColor: '#A142F4' },
        { num: '🧪', bg: '#34A853', label: 'Prototype', borderColor: '#34A853' },
        { num: '✅', bg: '#FBBC04', label: 'Test', borderColor: '#FBBC04' },
        { num: '🐞', bg: '#EA4335', label: 'Debug', borderColor: '#EA4335' },
        { num: '🔨', bg: '#00BCD4', label: 'Refactor', borderColor: '#00BCD4' },
        { num: '☁️', bg: '#D9458F', label: 'Deploy', borderColor: '#D9458F' },
        { num: '🔄', bg: '#4285F4', label: 'Iterate', borderColor: '#4285F4' },
      ] },
      sub: 'Each step you steer; each loop you learn. AI Studio excels at Idea→Prototype; Antigravity owns Prototype→Iterate.' }),

    s({ id: 'demo-timeline', part: 6, background: 'linear-gradient(135deg,#FFF7ED,#EEF2FF)', eyebrow: 'Part 6 · Live demo walkthrough', eyebrowClass: '',
      title: 'From chat to <span class="mark warm">live URL</span> — 10 steps',
      featureGrid: { cols: 5, items: [
        { icon: '1', iconClass: 'i-blue', title: 'Open AI Studio', body: '', borderColor: '#4285F4' },
        { icon: '2', iconClass: 'i-purple', title: 'Create a prompt', body: '', borderColor: '#A142F4' },
        { icon: '3', iconClass: 'i-green', title: 'Generate an app', body: '', borderColor: '#34A853' },
        { icon: '4', iconClass: 'i-yellow', title: 'Test it', body: '', borderColor: '#FBBC04' },
        { icon: '5', iconClass: 'i-cyan', title: 'Improve it', body: '', borderColor: '#00BCD4' },
        { icon: '6', iconClass: 'i-red', title: 'Export code', body: '', borderColor: '#EA4335' },
        { icon: '7', iconClass: 'i-blue', title: 'Open Antigravity', body: '', borderColor: '#4285F4' },
        { icon: '8', iconClass: 'i-purple', title: 'Continue dev', body: '', borderColor: '#A142F4' },
        { icon: '9', iconClass: 'i-green', title: 'Ask AI to debug', body: '', borderColor: '#34A853' },
        { icon: '10', iconClass: 'i-magenta', title: 'Deploy', body: '', borderColor: '#D9458F' },
      ] },
      imageSlots: [
        { name: 'build-mode-landing', label: 'Build Mode landing screenshot', description: 'Build Mode landing — a single text box "Describe what you want to build".' },
        { name: 'auxiliary-pane', label: 'Antigravity Auxiliary Pane screenshot', description: 'Antigravity Auxiliary Pane showing Task List + Implementation Plan artifact.' },
      ],
      interactive: { type: 'Prediction', bgClass: 'cool', label: '⚡ Prediction', question: '"How many minutes before we have a live URL? Place your bet."' } }),

    s({ id: 'best-practices', part: 7, eyebrow: 'Part 7 · Best practices',
      title: 'Stay the <span class="mark mint">smart copilot</span>, not a passenger',
      featureGrid: { cols: 3, items: [
        { icon: '🧘', iconClass: 'i-blue', title: 'Think first', body: 'Plan the goal before the prompt.', borderColor: '#4285F4' },
        { icon: '🤏', iconClass: 'i-purple', title: 'Small > huge', body: 'Small, sequential prompts win.', borderColor: '#A142F4' },
        { icon: '🔍', iconClass: 'i-green', title: 'Verify output', body: 'AI can be confidently wrong.', borderColor: '#34A853' },
        { icon: '📖', iconClass: 'i-yellow', title: 'Read the code', body: 'Skim what it generated — don\'t ship blind.', borderColor: '#FBBC04' },
        { icon: '🌿', iconClass: 'i-red', title: 'Use git', body: 'Commit often; revert easily.', borderColor: '#EA4335' },
        { icon: '🧱', iconClass: 'i-cyan', title: 'Learn fundamentals', body: 'AI boosts you — basics make you strong.', borderColor: '#00BCD4' },
      ] } }),

    s({ id: 'limitations', part: 8, background: 'linear-gradient(135deg,#FFF5F5,#FEF2F2)', eyebrow: 'Part 8 · Limitations', eyebrowClass: '',
      title: 'AI is powerful <span class="mark warm">— but imperfect</span>',
      featureGrid: { cols: 3, items: [
        { icon: '👻', iconClass: 'i-red', title: 'Hallucinations', body: 'Plausible-but-false facts & APIs.', borderColor: '#EA4335' },
        { icon: '🔐', iconClass: 'i-red', title: 'Security', body: 'Don\'t paste secrets; review auth code.', borderColor: '#EA4335' },
        { icon: '⚖️', iconClass: 'i-red', title: 'Licensing', body: 'Generated snippets — check usage rights.', borderColor: '#EA4335' },
        { icon: '🪟', iconClass: 'i-red', title: 'Context limits', body: 'Long chats "forget" early instructions.', borderColor: '#EA4335' },
        { icon: '🐛', iconClass: 'i-red', title: 'Generated bugs', body: 'Compiles ≠ correct. Test rigorously.', borderColor: '#EA4335' },
        { icon: '🧩', iconClass: 'i-red', title: 'Hidden complexity', body: 'Stacks you don\'t fully understand yet.', borderColor: '#EA4335' },
      ] },
      sub: '⚠ <em>Verify before class</em> any feature names/version numbers — tools evolve fast.' }),

    s({ id: 'future', part: 9, slideType: 'hero-alt', background: 'linear-gradient(135deg,#34A853 0%,#00BCD4 55%,#A142F4 100%)',
      eyebrow: 'Part 9 · The road ahead', eyebrowClass: 'white',
      title: 'The future is <span style="background-image:linear-gradient(120deg,#fff,#FBBC04);-webkit-background-clip:text;background-clip:text;color:transparent">agentic</span>',
      lede: 'You\'re entering the field at its most exciting moment.',
      featureGrid: { cols: 3, items: [
        { icon: '🤖', iconClass: '', title: 'AI Agents', body: 'Agents that plan, act, verify.', borderColor: '#fff' },
        { icon: '🧭', iconClass: '', title: 'Multi-agent systems', body: 'Teams of specialized agents.', borderColor: '#fff' },
        { icon: '🧑‍💻', iconClass: '', title: 'Coding copilots', body: 'Always-on pair programmers.', borderColor: '#fff' },
        { icon: '🛰', iconClass: '', title: 'Autonomous software eng.', body: 'Ship features while you sleep.', borderColor: '#fff' },
        { icon: '🚀', iconClass: '', title: 'Career opportunities', body: 'New roles: prompt eng, agent ops.', borderColor: '#fff' },
        { icon: '🎓', iconClass: '', title: 'Your edge', body: 'Start now — fundamentals + AI fluency.', borderColor: '#fff' },
      ] },
      interactive: { type: 'Ask the Audience', bgClass: '', label: '❓ Ask the Audience', question: '"What will AI build for the world — with you on the team?"' } }),

    s({ id: 'thank-you', part: 9, slideType: 'hero-alt', background: 'linear-gradient(135deg,#0F172A,#1E293B)', eyebrow: 'Thank you!', eyebrowClass: 'white',
      title: 'Questions? 🙋', lede: 'Keep building. You\'ve got the vibe. Now keep the skills sharp.',
      cols: {
        left: { cards: [{ title: '📚 Resources', body: '', titleColor: '#FCD34D' }], bullets: { items: ['🧪 <a href="https://aistudio.google.com">Google AI Studio</a><br><span style="font-size:.9rem;color:#94A3B8">aistudio.google.com</span>', '📘 <a href="https://ai.google.dev/gemini-api/docs/ai-studio-quickstart">Gemini API Documentation</a><br><span style="font-size:.9rem;color:#94A3B8">ai.google.dev/gemini-api/docs</span>', '🤖 <a href="https://codelabs.developers.google.com/getting-started-google-antigravity">Google Antigravity Codelab</a><br><span style="font-size:.9rem;color:#94A3B8">codelabs.developers.google.com</span>'] } },
        right: { imageSlots: [{ name: 'qr-code', label: 'QR Code', description: 'QR code placeholder for course resources.' }] }
      },
      footMeta: { left: 'Building Apps with Google AI Studio & Antigravity', right: 'Keep the curiosity alive · 2026' } }),
  ];
}
