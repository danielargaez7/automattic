'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Sparkles,
  Download,
  RotateCcw,
  Loader2,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  Cloud,
  Upload,
  X,
  Link,
  Shield,
  Eye,
} from 'lucide-react';
import { SITE_TYPES, VIBES } from '@/lib/schemas/user-input';

// ─── Types ───
type WizardStep = 1 | 2 | 3 | 4 | 5;

interface AccessibilityCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  details: string;
}

interface AccessibilityScoreData {
  overall: number;
  grade: string;
  checks: AccessibilityCheck[];
}

interface ColorToken {
  slug: string;
  name: string;
  hex: string;
  role: string;
}

interface GenerationMetadata {
  name: string;
  slug: string;
  description: string;
  files: string[];
  model: string;
  tokensUsed: number;
  repairAttempts: number;
  colors?: ColorToken[];
}

interface ThemeVariation {
  zip: string;
  metadata: GenerationMetadata;
  accessibility: AccessibilityScoreData;
}

interface UploadedImage {
  data: string;
  mimeType: string;
  preview: string;
  name: string;
}

interface ExtractedDesign {
  url: string;
  colors: string[];
  fontFamilies: string[];
  mood: string;
}

interface ThemeHistoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  colors: ColorToken[];
  grade: string;
  zip: string;
  createdAt: number;
}

// ─── Constants ───
const STEP_LABELS = ['Describe', 'Vibe', 'Site Type', 'Building', 'Result'];

const VIBE_DATA: Record<string, { icon: string; gradient: string; desc: string }> = {
  minimalist: { icon: '◻', gradient: 'from-zinc-400 to-zinc-600', desc: 'Clean & simple' },
  bold: { icon: '◼', gradient: 'from-red-400 to-orange-500', desc: 'Strong & striking' },
  elegant: { icon: '◇', gradient: 'from-amber-300 to-yellow-500', desc: 'Refined & luxurious' },
  playful: { icon: '○', gradient: 'from-pink-400 to-purple-500', desc: 'Fun & energetic' },
  corporate: { icon: '▣', gradient: 'from-blue-400 to-cyan-500', desc: 'Professional & trusted' },
  organic: { icon: '◎', gradient: 'from-green-400 to-emerald-500', desc: 'Natural & flowing' },
  dark: { icon: '●', gradient: 'from-zinc-600 to-zinc-800', desc: 'Moody & immersive' },
  warm: { icon: '◉', gradient: 'from-orange-400 to-red-400', desc: 'Inviting & cozy' },
};

const SITE_TYPE_DATA: Record<string, { icon: string; desc: string }> = {
  blog: { icon: '📝', desc: 'Articles & stories' },
  portfolio: { icon: '🎨', desc: 'Showcase your work' },
  business: { icon: '💼', desc: 'Company & services' },
  ecommerce: { icon: '🛍️', desc: 'Online store' },
  personal: { icon: '👤', desc: 'Your personal space' },
  agency: { icon: '🏢', desc: 'Team & clients' },
};

const GENERATION_STAGES = [
  { label: 'Reading your vision...', icon: '👁️' },
  { label: 'Analyzing inspiration...', icon: '🎨' },
  { label: 'Designing color palette & typography...', icon: '✍️' },
  { label: 'Crafting layout & patterns...', icon: '🏗️' },
  { label: 'Validating theme structure...', icon: '🔍' },
  { label: 'Scoring accessibility...', icon: '♿' },
  { label: 'Packaging your theme...', icon: '📦' },
];

export default function Home() {
  const [step, setStep] = useState<WizardStep>(1);
  const [description, setDescription] = useState('');
  const [vibe, setVibe] = useState('');
  const [siteType, setSiteType] = useState('');
  const [colorPreferences, setColorPreferences] = useState('');
  const [fontPreferences, setFontPreferences] = useState('');
  const [error, setError] = useState('');
  const [zipData, setZipData] = useState('');
  const [metadata, setMetadata] = useState<GenerationMetadata | null>(null);
  const [accessibility, setAccessibility] = useState<AccessibilityScoreData | null>(null);
  const [generationStage, setGenerationStage] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [variations, setVariations] = useState<ThemeVariation[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const playgroundRef = useRef<HTMLIFrameElement>(null);

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL extraction state
  const [referenceUrl, setReferenceUrl] = useState('');
  const [extractedDesign, setExtractedDesign] = useState<ExtractedDesign | null>(null);
  const [extracting, setExtracting] = useState(false);

  // WordPress.com publish state
  const [wpPublishing, setWpPublishing] = useState(false);
  const [wpPublished, setWpPublished] = useState<{ siteUrl: string; themeName: string } | null>(null);
  const [wpSites, setWpSites] = useState<Array<{ ID: number; name: string; URL: string }>>([]);
  const [showWpSitePicker, setShowWpSitePicker] = useState(false);

  // Auto-load Playground when a theme is ready on step 5
  useEffect(() => {
    if (step === 5 && metadata && zipData) {
      const t = setTimeout(() => loadThemeInPlayground(), 1500);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  // Handle WordPress.com OAuth return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wpAuth = params.get('wp_auth');
    if (!wpAuth) return;
    window.history.replaceState({}, '', '/');

    if (wpAuth === 'success') {
      try {
        const pending = JSON.parse(localStorage.getItem('wp_pending_publish') || 'null');
        if (!pending) return;
        setZipData(pending.zip);
        setMetadata((m) => m ?? { name: pending.name, slug: pending.slug, description: '', files: [], model: '', tokensUsed: 0, repairAttempts: 0, colors: [] });
        setStep(5);
        // Fetch sites for picker
        fetch('/api/auth/wordpress/sites')
          .then((r) => r.json())
          .then(({ sites }) => {
            if (sites?.length) {
              setWpSites(sites);
              setShowWpSitePicker(true);
            }
          })
          .catch(() => {});
      } catch {}
    }
  }, []);

  function handlePublishToWordPress() {
    if (!zipData || !metadata) return;
    try {
      localStorage.setItem('wp_pending_publish', JSON.stringify({ zip: zipData, slug: metadata.slug, name: metadata.name }));
    } catch {}
    const clientId = process.env.NEXT_PUBLIC_WORDPRESS_CLIENT_ID;
    if (!clientId) {
      window.open('https://wordpress.com/themes', '_blank');
      return;
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${appUrl}/api/auth/wordpress/callback`,
      response_type: 'code',
      scope: 'global',
    });
    window.location.href = `https://public-api.wordpress.com/oauth2/authorize?${params}`;
  }

  async function handlePublishToSite(siteId: number, siteUrl: string) {
    if (!zipData || !metadata) return;
    setShowWpSitePicker(false);
    setWpPublishing(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip: zipData, slug: metadata.slug, siteId }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Publish failed');
      }
      localStorage.removeItem('wp_pending_publish');
      setWpPublished({ siteUrl, themeName: metadata.name });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish to WordPress.com failed');
    } finally {
      setWpPublishing(false);
    }
  }

  // Theme history
  const [history, setHistory] = useState<ThemeHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dreambuilder_history');
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  function saveToHistory(item: ThemeHistoryItem) {
    setHistory((prev) => {
      const updated = [item, ...prev.filter((h) => h.id !== item.id)].slice(0, 5);
      try { localStorage.setItem('dreambuilder_history', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }

  function loadFromHistory(item: ThemeHistoryItem) {
    setZipData(item.zip);
    setMetadata({ name: item.name, slug: item.slug, description: item.description, files: [], model: '', tokensUsed: 0, repairAttempts: 0, colors: item.colors });
    setAccessibility({ overall: 0, grade: item.grade, checks: [] });
    setVariations([]);
    setSelectedVariation(null);
    setStep(5);
  }

  const canProceedFromStep1 = description.trim().length >= 10;

  // ─── Animated placeholder rotation ───
  const PLACEHOLDER_EXAMPLES = [
    'A minimalist portfolio for a landscape photographer',
    'A bold SaaS landing page with pricing and testimonials',
    'A warm cooking blog with earthy tones and serif fonts',
    'A dark mode agency site with neon accents and large typography',
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderPhase, setPlaceholderPhase] = useState<'typing' | 'waiting' | 'dots' | 'deleting'>('typing');
  const placeholderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't animate if user has typed something
    if (description.length > 0 || step !== 1) return;

    const example = PLACEHOLDER_EXAMPLES[placeholderIndex];

    if (placeholderPhase === 'typing') {
      if (placeholderText.length < example.length) {
        placeholderTimer.current = setTimeout(() => {
          setPlaceholderText(example.slice(0, placeholderText.length + 1));
        }, 35);
      } else {
        // Done typing, go to waiting
        setPlaceholderPhase('waiting');
      }
    } else if (placeholderPhase === 'waiting') {
      placeholderTimer.current = setTimeout(() => {
        setPlaceholderPhase('dots');
      }, 5000);
    } else if (placeholderPhase === 'dots') {
      // Show dots animation for 2 seconds then start deleting
      placeholderTimer.current = setTimeout(() => {
        setPlaceholderPhase('deleting');
      }, 2000);
    } else if (placeholderPhase === 'deleting') {
      if (placeholderText.length > 0) {
        placeholderTimer.current = setTimeout(() => {
          setPlaceholderText(placeholderText.slice(0, -2)); // delete 2 chars at a time for speed
        }, 15);
      } else {
        // Done deleting, move to next example
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_EXAMPLES.length);
        setPlaceholderPhase('typing');
      }
    }

    return () => {
      if (placeholderTimer.current) clearTimeout(placeholderTimer.current);
    };
  }, [placeholderText, placeholderPhase, placeholderIndex, description.length, step]);

  const displayPlaceholder =
    description.length > 0
      ? ''
      : placeholderPhase === 'dots'
        ? placeholderText + ' ...'
        : placeholderText + (placeholderPhase === 'typing' ? '|' : '');

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, 5) as WizardStep);
  }, []);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1) as WizardStep);
  }, []);

  // ─── Image Upload ───
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (uploadedImages.length >= 3) break;
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 5 * 1024 * 1024) continue; // 5MB max

      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        setUploadedImages((prev) => [
          ...prev.slice(0, 2),
          { data: base64, mimeType: file.type, preview: result, name: file.name },
        ]);
        const colors = await extractColorsFromImage(result);
        setExtractedPalette((prev) => {
          const combined = [...new Set([...prev, ...colors])].slice(0, 10);
          return combined;
        });
      };
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }

  // ─── Client-side palette extraction via Canvas ───
  function extractColorsFromImage(dataUrl: string): Promise<string[]> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve([]); return; }
        ctx.drawImage(img, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;
        const buckets = new Map<string, number>();
        for (let i = 0; i < data.length; i += 4) {
          const r = Math.round(data[i] / 24) * 24;
          const g = Math.round(data[i + 1] / 24) * 24;
          const b = Math.round(data[i + 2] / 24) * 24;
          const brightness = (r + g + b) / 3;
          if (brightness > 240 || brightness < 15) continue;
          const key = `${r},${g},${b}`;
          buckets.set(key, (buckets.get(key) || 0) + 1);
        }
        const sorted = [...buckets.entries()].sort((a, b) => b[1] - a[1]);
        const picked: string[] = [];
        for (const [key] of sorted) {
          if (picked.length >= 6) break;
          const [r, g, b] = key.split(',').map(Number);
          const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
          const tooClose = picked.some(existing => {
            const er = parseInt(existing.slice(1, 3), 16);
            const eg = parseInt(existing.slice(3, 5), 16);
            const eb = parseInt(existing.slice(5, 7), 16);
            return Math.sqrt((er - r) ** 2 + (eg - g) ** 2 + (eb - b) ** 2) < 60;
          });
          if (!tooClose) picked.push(hex);
        }
        resolve(picked);
      };
      img.src = dataUrl;
    });
  }

  // ─── URL Extraction ───
  async function handleExtractUrl() {
    if (!referenceUrl.trim()) return;
    setExtracting(true);
    setError('');

    try {
      const res = await fetch('/api/extract-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: referenceUrl.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to extract design');
      }

      const data = await res.json();
      setExtractedDesign(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to extract design from URL');
    } finally {
      setExtracting(false);
    }
  }

  // ─── Generate ───
  async function handleGenerate() {
    setError('');
    setStep(4);
    setGenerationStage(0);
    setVariations([]);
    setSelectedVariation(null);

    const stageInterval = setInterval(() => {
      setGenerationStage((prev) => Math.min(prev + 1, GENERATION_STAGES.length - 1));
    }, 2500);

    try {
      const body: Record<string, unknown> = {
        description: description.trim(),
        variations: true,
      };
      if (siteType) body.siteType = siteType;
      if (vibe) body.vibe = vibe;
      if (colorPreferences) body.colorPreferences = colorPreferences;
      if (fontPreferences) body.fontPreferences = fontPreferences;
      if (uploadedImages.length > 0) {
        body.inspirationImages = uploadedImages.map((img) => ({
          data: img.data,
          mimeType: img.mimeType,
        }));
      }
      if (extractedDesign) body.extractedDesign = extractedDesign;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      clearInterval(stageInterval);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Generation failed (${res.status})`);
      }

      const data = await res.json();

      if (data.variations && data.variations.length > 0) {
        setVariations(data.variations);
        setStep(5);
      } else {
        setZipData(data.zip);
        setMetadata(data.metadata);
        setAccessibility(data.accessibility);
        setStep(5);
        saveToHistory({
          id: `${data.metadata.slug}-${Date.now()}`,
          name: data.metadata.name,
          slug: data.metadata.slug,
          description: data.metadata.description,
          colors: data.metadata.colors || [],
          grade: data.accessibility.grade,
          zip: data.zip,
          createdAt: Date.now(),
        });
      }
    } catch (err: unknown) {
      clearInterval(stageInterval);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStep(3);
    }
  }

  function selectVariation(index: number) {
    const v = variations[index];
    setSelectedVariation(index);
    setZipData(v.zip);
    setMetadata(v.metadata);
    setAccessibility(v.accessibility);
    saveToHistory({
      id: `${v.metadata.slug}-${Date.now()}`,
      name: v.metadata.name,
      slug: v.metadata.slug,
      description: v.metadata.description,
      colors: v.metadata.colors || [],
      grade: v.accessibility.grade,
      zip: v.zip,
      createdAt: Date.now(),
    });
  }

  async function loadThemeInPlayground() {
    if (!zipData || !playgroundRef.current) return;
    try {
      const { startPlaygroundWeb } = await import('@wp-playground/client');
      const bytes = Uint8Array.from(atob(zipData), (c) => c.charCodeAt(0));
      // Pass theme via Blueprint so it runs inside the iframe — avoids Comlink bug entirely
      await startPlaygroundWeb({
        iframe: playgroundRef.current,
        remoteUrl: 'https://playground.wordpress.net/remote.html',
        blueprint: {
          landingPage: '/',
          steps: [
            {
              step: 'installTheme',
              themeData: {
                resource: 'literal',
                name: `${metadata?.slug || 'theme'}.zip`,
                contents: bytes,
              },
            },
          ],
        },
      });
    } catch (e) {
      console.warn('Playground theme load failed:', e);
    }
  }

  function handleDownload() {
    if (!zipData || !metadata) return;
    const blob = new Blob([Uint8Array.from(atob(zipData), (c) => c.charCodeAt(0))], {
      type: 'application/zip',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.slug}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setStep(1);
    setDescription('');
    setSiteType('');
    setVibe('');
    setColorPreferences('');
    setFontPreferences('');
    setError('');
    setZipData('');
    setMetadata(null);
    setAccessibility(null);
    setUploadedImages([]);
    setExtractedPalette([]);
    setReferenceUrl('');
    setExtractedDesign(null);
    setShowPreview(false);
    setVariations([]);
    setSelectedVariation(null);
    setWpPublishing(false);
    setWpPublished(null);
  }

  // Grade color helper
  function gradeColor(grade: string) {
    if (grade === 'A') return 'text-emerald-400';
    if (grade === 'B') return 'text-emerald-300';
    if (grade === 'C') return 'text-amber-400';
    return 'text-red-400';
  }

  const isLanding = step === 1;

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden hero-bg-blend text-gray-900">


      {/* Header */}
      {!isLanding && (
        <header className="relative z-10 px-6 py-5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button onClick={handleReset} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <Cloud className="w-7 h-7 text-[#F3A8B1]" />
              <span className="text-xl font-bold tracking-tight text-white text-glow">
                DreamBuilder
              </span>
            </button>
            {step > 1 && step < 4 && (
              <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
        </header>
      )}

      {/* Step Tracker — only visible on steps 2 and 3, animates in */}
      {step >= 2 && step <= 3 && (
        <div className="relative z-10 px-6 pb-2 animate-fade-in">
          <div className="max-w-md mx-auto flex items-center justify-between">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`step-dot w-3 h-3 rounded-full transition-all duration-500 ${step >= s ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-110' : 'bg-white/30 scale-100'}`} />
                  <span className={`text-xs mt-1.5 transition-colors duration-500 ${step >= s ? 'text-white' : 'text-white/40'}`}>{STEP_LABELS[i]}</span>
                </div>
                {i < 2 && <div className={`step-line w-24 sm:w-32 h-0.5 mx-3 mt-[-14px] transition-all duration-700 ${step > s ? 'bg-white' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 flex-1 flex ${isLanding ? 'items-start pt-0' : 'items-center'} justify-center px-6 py-8`}>
        <div className={`w-full ${step === 5 ? 'max-w-5xl' : 'max-w-2xl'}`}>

          {/* ═══ STEP 1: Ethereal Cloud Landing ═══ */}
          {step === 1 && (
            <div className="animate-fade-in w-full max-w-4xl mx-auto flex flex-col items-center justify-center relative">
              {/* Cloud image — bobs up and down */}
              <div className="absolute inset-0 flex items-center justify-center floating-cloud">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Pink ethereal cloud"
                  className="w-[700px] max-w-[90vw] h-auto object-contain drop-shadow-2xl"
                  src="/Cloud.png"
                />
              </div>

              {/* All content — stays still, layered on top */}
              <div className="relative flex items-end justify-center" style={{ minHeight: '500px' }}>
                <div className="flex flex-col items-center justify-center text-center px-6 pb-[10%]">
                  {/* Title */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-glow">
                    DreamBuilder
                  </h1>
                  <p className="mt-2 text-sm md:text-base text-white/80 font-medium tracking-wide text-glow-soft">
                    Powered by AI. Built for WordPress.
                  </p>
                  {/* Input bar — ON the cloud with pixie dust */}
                  <div className="w-full max-w-lg mt-6 px-4 relative pixie-dust">
                    <div className="sparkle-field">
                      <span /><span /><span /><span /><span /><span />
                    </div>
                    <div className="relative flex items-end">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && canProceedFromStep1) { e.preventDefault(); goNext(); } }}
                        placeholder={displayPlaceholder}
                        rows={2}
                        style={{ maxHeight: '6.5rem' }}
                        className="w-full py-4 px-6 pr-14 bg-white/95 backdrop-blur border-0 rounded-3xl text-base text-gray-700 pixie-glow focus:ring-4 focus:ring-[#F3A8B1]/30 focus:outline-none transition-all duration-300 placeholder:text-gray-300 resize-none overflow-y-auto"
                      />
                      <button
                        onClick={goNext}
                        disabled={!canProceedFromStep1}
                        aria-label="Submit"
                        className={`absolute right-2 bottom-2.5 p-2.5 rounded-full transition-colors duration-300 cursor-pointer ${
                          canProceedFromStep1
                            ? 'bg-[#007AFF] text-white hover:bg-[#0066dd] shadow-md'
                            : 'bg-[#007AFF]/50 text-white/60 cursor-not-allowed'
                        }`}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          )}

          {/* ═══ STEP 2: Visual Vibe + Images + URL ═══ */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white text-glow">Choose your vibe</h2>
                <p className="text-white/60">Pick a mood, drop in inspiration, or borrow a design system.</p>
              </div>

              {error && (
                <div className="bg-white/90 border border-red-300 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              {/* Three-column layout */}
              <div className="grid grid-cols-3 gap-4 items-stretch">

                {/* LEFT — Pick a mood */}
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-3 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-white/80 mb-1">Pick a mood</p>
                  <div className="grid grid-cols-2 gap-2">
                    {VIBES.map((v) => {
                      const data = VIBE_DATA[v];
                      return (
                        <button key={v} onClick={() => setVibe(vibe === v ? '' : v)}
                          className={`vibe-card group relative rounded-xl border text-center transition-all cursor-pointer overflow-hidden ${vibe === v ? 'border-white ring-2 ring-white/60 shadow-lg scale-[1.02]' : 'border-white/20 hover:border-white/50'}`}>
                          <div className="relative w-full aspect-[5/4]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`/vibes/${v}.jpg`} alt={v} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 transition-opacity duration-300 ${vibe === v ? 'bg-black/10' : 'bg-black/35 group-hover:bg-black/0'}`} />
                            <div className="absolute bottom-0 inset-x-0 p-1 text-center">
                              <div className="text-[11px] font-bold text-white drop-shadow-md">{v.charAt(0).toUpperCase() + v.slice(1)}</div>
                              <div className="text-[9px] text-white/70 hidden sm:block">{data.desc}</div>
                            </div>
                            {vibe === v && <div className="absolute top-1 right-1"><Check className="w-3.5 h-3.5 text-white drop-shadow-md" /></div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* MIDDLE — Drop images */}
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-3 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Drop images
                    <span className="text-white/40 font-normal">(up to 3)</span>
                  </p>
                  <div className="flex-1 flex flex-col gap-2">
                    {uploadedImages.map((img, i) => (
                      <div key={i} className="relative w-full h-20 rounded-xl overflow-hidden border border-white/30 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {uploadedImages.length < 3 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const files = e.dataTransfer.files;
                          if (!files) return;
                          for (const file of Array.from(files)) {
                            if (uploadedImages.length >= 3) break;
                            if (!file.type.startsWith('image/')) continue;
                            if (file.size > 5 * 1024 * 1024) continue;
                            const reader = new FileReader();
                            reader.onload = () => {
                              const result = reader.result as string;
                              const base64 = result.split(',')[1];
                              setUploadedImages((prev) => [...prev.slice(0, 2), { data: base64, mimeType: file.type, preview: result, name: file.name }]);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="flex-1 min-h-[120px] w-full rounded-xl border-2 border-dashed border-white/25 hover:border-white/50 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white/70 transition-all cursor-pointer">
                        <Upload className="w-6 h-6" />
                        <span className="text-xs">Drop or click to upload</span>
                      </button>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  {/* Extracted palette preview */}
                  {extractedPalette.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] text-white/50 mb-1">Extracted palette</p>
                      <div className="flex gap-1 flex-wrap">
                        {extractedPalette.map((c) => (
                          <div key={c} className="w-5 h-5 rounded-md border border-white/20 shadow-sm" style={{ backgroundColor: c }} title={c} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT — Borrow URL + font/color hints */}
                <div className="flex flex-col gap-3">

                  {/* Borrow a design */}
                  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-3 space-y-2">
                    <p className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5" /> Borrow a design from any website
                    </p>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={referenceUrl}
                        onChange={(e) => setReferenceUrl(e.target.value)}
                        placeholder="https://stripe.com"
                        className="flex-1 min-w-0 bg-white/15 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/40"
                      />
                      <button onClick={handleExtractUrl} disabled={!referenceUrl.trim() || extracting}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${referenceUrl.trim() && !extracting ? 'bg-white/20 text-white hover:bg-white/30 cursor-pointer' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>
                        {extracting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Go'}
                      </button>
                    </div>
                    {extractedDesign && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1 text-[10px] text-emerald-300">
                          <Check className="w-3 h-3" /> Extracted
                        </div>
                        {extractedDesign.colors.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {extractedDesign.colors.slice(0, 6).map((c) => (
                              <div key={c} className="w-4 h-4 rounded border border-white/30" style={{ backgroundColor: c }} title={c} />
                            ))}
                          </div>
                        )}
                        <div className="text-[10px] text-white/60">{extractedDesign.mood}</div>
                      </div>
                    )}
                  </div>

                  {/* Font / color hints */}
                  <div className="flex-1 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-3 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-white/80">Describe in detail font or color hints</p>
                    <textarea
                      value={`${colorPreferences}${colorPreferences && fontPreferences ? '\n' : ''}${fontPreferences}`}
                      onChange={(e) => {
                        const val = e.target.value;
                        setColorPreferences(val);
                        setFontPreferences('');
                      }}
                      placeholder={"e.g. dark navy with gold accents, modern sans-serif"}
                      className="flex-1 w-full bg-white/15 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/40 resize-none"
                    />
                  </div>

                </div>
              </div>

              <button onClick={goNext}
                className="w-full py-3 px-6 rounded-full font-semibold text-base bg-white text-[#e8818b] hover:bg-white/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ether-shadow">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ═══ STEP 3: Site Type ═══ */}
          {step === 3 && (
            <div className="animate-fade-in space-y-8">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-white text-glow">What kind of site?</h2>
                <p className="text-white/60">This helps us pick the right patterns and layout.</p>
              </div>

              {error && (
                <div className="bg-white/90 border border-red-300 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SITE_TYPES.map((t) => {
                  const data = SITE_TYPE_DATA[t];
                  return (
                    <button key={t} onClick={() => setSiteType(siteType === t ? '' : t)}
                      className={`vibe-card relative py-6 px-4 rounded-xl border text-center transition-all cursor-pointer backdrop-blur ${siteType === t ? 'border-white bg-white/30 ring-1 ring-white/40 shadow-lg' : 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/40'}`}>
                      <div className="text-2xl mb-2">{data.icon}</div>
                      <div className={`text-sm font-semibold ${siteType === t ? 'text-white' : 'text-white/80'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</div>
                      <div className="text-xs text-white/50 mt-0.5">{data.desc}</div>
                      {siteType === t && <div className="absolute top-2 right-2"><Check className="w-4 h-4 text-white" /></div>}
                    </button>
                  );
                })}
              </div>

              {/* Brief Summary */}
              <div className="bg-white/15 backdrop-blur border border-white/20 rounded-xl p-4 space-y-2">
                <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Your theme brief</p>
                <p className="text-sm text-white/90">&ldquo;{description}&rdquo;</p>
                <div className="flex gap-2 flex-wrap">
                  {vibe && <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">{vibe}</span>}
                  {siteType && <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">{siteType}</span>}
                  {uploadedImages.length > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">{uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''}</span>}
                  {extractedDesign && <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">URL design</span>}
                  {colorPreferences && <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">{colorPreferences}</span>}
                  {fontPreferences && <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">{fontPreferences}</span>}
                </div>
              </div>

              <button onClick={handleGenerate}
                className="w-full py-4 px-6 rounded-full font-bold text-lg bg-white text-[#e8818b] hover:bg-white/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ether-shadow">
                <Sparkles className="w-5 h-5" /> Build My Dream
              </button>
            </div>
          )}

          {/* ═══ STEP 4: Building ═══ */}
          {step === 4 && (
            <div className="animate-fade-in text-center space-y-10 py-8">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 border border-white/30">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h2 className="text-3xl font-bold text-white text-glow">Building your dream...</h2>
                <p className="text-white/50">This typically takes 15-30 seconds.</p>
              </div>
              <div className="max-w-sm mx-auto space-y-4">
                {GENERATION_STAGES.map((stage, i) => (
                  <div key={stage.label} className={`flex items-center gap-4 text-sm transition-all duration-500 ${i <= generationStage ? 'opacity-100' : 'opacity-30'}`}>
                    {i < generationStage ? (
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-white" /></div>
                    ) : i === generationStage ? (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Loader2 className="w-4 h-4 text-white animate-spin" /></div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0"><span className="text-sm">{stage.icon}</span></div>
                    )}
                    <span className={i <= generationStage ? 'text-white' : 'text-white/40'}>{stage.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ STEP 5: Result ═══ */}
          {step === 5 && (variations.length > 0 || metadata) && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white text-glow">
                  {variations.length > 0 && selectedVariation === null
                    ? 'Pick your favorite'
                    : `Your dream ${siteType || 'site'} is ready!`}
                </h2>
                {metadata && <p className="text-white/60"><strong className="text-white">{metadata.name}</strong></p>}
              </div>

              {/* ── Variation picker ── */}
              {variations.length > 0 && selectedVariation === null && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white/60 text-sm">We generated 3 variations — pick the one that speaks to you</p>
                    <button onClick={handleGenerate}
                      className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/20 hover:border-white/40 rounded-full px-3 py-1.5 transition-all cursor-pointer backdrop-blur">
                      <RotateCcw className="w-3 h-3" /> Redo
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {variations.map((v, i) => (
                      <button key={i} onClick={() => selectVariation(i)}
                        className="bg-white/10 backdrop-blur border border-white/20 hover:border-white/60 rounded-2xl p-4 text-left space-y-3 transition-all cursor-pointer hover:scale-[1.02]">
                        <div className="flex gap-1.5">
                          {(v.metadata.colors || []).slice(0, 5).map((c) => (
                            <div key={c.slug} className="flex-1 h-8 rounded-lg" style={{ backgroundColor: c.hex }} title={c.name} />
                          ))}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{v.metadata.name}</p>
                          <p className="text-white/50 text-xs mt-0.5 line-clamp-2">{v.metadata.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${v.accessibility.grade === 'A' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {v.accessibility.grade} {v.accessibility.overall}/100
                          </span>
                          <span className="text-xs text-white/40">{v.metadata.files.length} files</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Result grid ── */}
              {metadata && (
                <div className="grid gap-4" style={{ gridTemplateColumns: '0.6fr 2fr' }}>

                  {/* LEFT COLUMN */}
                  <div className="space-y-4">

                    {/* Accessibility Score — compact */}
                    {accessibility && (
                      <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
                        <p className="text-xs text-white/50 mb-3 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-[#F3A8B1]" /> Accessibility Score
                        </p>
                        <div className="flex items-end gap-2">
                          <span className={`text-5xl font-bold leading-none ${accessibility.grade === 'A' ? 'text-emerald-400' : accessibility.grade === 'B' ? 'text-emerald-300' : accessibility.grade === 'C' ? 'text-amber-400' : 'text-red-400'}`}>
                            {accessibility.grade}
                          </span>
                          <span className="text-white/50 text-lg pb-0.5">{accessibility.overall}/100</span>
                        </div>
                        <div className="mt-3 space-y-1.5">
                          {accessibility.checks.map((check) => (
                            <div key={check.name} className="flex items-center gap-1.5 text-xs text-white/50">
                              {check.status === 'pass'
                                ? <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                : check.status === 'warn'
                                ? <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                                : <X className="w-3 h-3 text-red-400 shrink-0" />}
                              <span>{check.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Theme metadata */}
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 space-y-3">
                      <div>
                        <span className="text-xs text-white/40 uppercase tracking-wider">Name</span>
                        <p className="text-white font-medium mt-0.5">{metadata.name}</p>
                      </div>
                      <div>
                        <span className="text-xs text-white/40 uppercase tracking-wider">Slug</span>
                        <p className="text-white/60 font-mono text-sm mt-0.5">{metadata.slug}</p>
                      </div>
                      <div>
                        <span className="text-xs text-white/40 uppercase tracking-wider">Description</span>
                        <p className="text-white/60 text-sm mt-0.5">{metadata.description}</p>
                      </div>
                      <div className="pt-1 border-t border-white/10 flex gap-3 text-xs text-white/30">
                        <span>{metadata.model}</span>
                        <span>{metadata.tokensUsed.toLocaleString()} tokens</span>
                        {metadata.repairAttempts > 0 && <span>Repairs: {metadata.repairAttempts}</span>}
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="space-y-3">

                    {/* Download */}
                    <button onClick={handleDownload}
                      className="w-full py-3.5 px-6 rounded-2xl font-bold bg-white text-[#e8818b] hover:bg-white/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ether-shadow">
                      <Download className="w-5 h-5" /> Download ZIP
                    </button>

                    {/* Publish */}
                    {wpPublished ? (
                      <a href={wpPublished.siteUrl} target="_blank" rel="noopener noreferrer"
                        className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm bg-emerald-500/80 text-white hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur">
                        <Check className="w-4 h-4" /> Published! View on WordPress.com
                      </a>
                    ) : (
                      <button onClick={handlePublishToWordPress} disabled={wpPublishing}
                        className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm border border-white/30 text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur disabled:opacity-50 disabled:cursor-not-allowed">
                        {wpPublishing
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                          : <><Cloud className="w-4 h-4" /> Publish to WordPress</>}
                      </button>
                    )}

                    {/* Playground preview — always visible */}
                    <div className="rounded-2xl overflow-hidden border border-white/20 bg-white shadow-lg" style={{ height: '420px' }}>
                      <div className="bg-white/5 px-3 py-2 flex items-center gap-2 border-b border-white/10">
                        <Eye className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-xs text-white/40">Preview WordPress Playground</span>
                      </div>
                      <div style={{ position: 'relative', overflow: 'hidden', height: 'calc(100% - 33px)' }}>
                        <iframe
                          ref={playgroundRef}
                          src="https://playground.wordpress.net/remote.html"
                          title="WordPress Playground Preview"
                          style={{ width: '150%', height: '150%', transform: 'scale(0.667)', transformOrigin: '0 0', border: 0 }}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Start over */}
              {metadata && (
                <div className="text-center">
                  <button onClick={handleReset}
                    className="text-white/30 hover:text-white/60 text-sm transition-all inline-flex items-center gap-1.5 cursor-pointer">
                    <RotateCcw className="w-3.5 h-3.5" /> Start over
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="relative z-10 px-6 py-4 text-center text-xs text-white/30">
        DreamBuilder — Powered by AI. Built for WordPress.
      </footer>

      {/* WordPress.com site picker modal */}
      {showWpSitePicker && wpSites.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Choose a site to publish to</h3>
              <button onClick={() => setShowWpSitePicker(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {wpSites.map((site) => (
                <button key={site.ID} onClick={() => handlePublishToSite(site.ID, site.URL)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-[#F3A8B1] hover:bg-pink-50 transition-all cursor-pointer text-left group">
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#e8818b]">{site.name}</p>
                    <p className="text-xs text-gray-400">{site.URL}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#e8818b]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
