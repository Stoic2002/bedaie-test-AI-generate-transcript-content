"use client";

import { useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { PROVIDER_MODELS, PROVIDER_LABELS } from "@/lib/models";
import { getTranslations } from "@/lib/i18n";
import {
  Copy,
  Download,
  Loader2,
  Sparkles,
  Wand2,
  LayoutTemplate,
  X,
  Layers,
  AlignLeft,
  Mail,
  Megaphone,
  FileText,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Monitor, Mic, Type } from "lucide-react";

// ── Content Templates ────────────────────────────────────────
const TEMPLATE_ICONS: Record<string, React.ElementType> = {
  "Marketing Video": Megaphone,
  "Educational Clip": FileText,
  "Social Media Reel": Sparkles,
  "Product Demo": ShoppingBag,
  "Explainer Video": LayoutTemplate,
};

const TEMPLATES = [
  {
    name: "Marketing Video",
    data: {
      videoType: "Marketing Video",
      duration: "30s",
      topic: "Introducing our new product to existing customers",
      keywords: "launch, exclusive, limited-time, innovation",
      audience: "Existing customers and subscribers",
      tone: "Persuasive",
    },
  },
  {
    name: "Educational Clip",
    data: {
      videoType: "Educational Clip",
      duration: "60s",
      topic: "How AI is changing web development",
      keywords: "tips, best practices, future of AI",
      audience: "Industry professionals and beginners",
      tone: "Informative",
    },
  },
  {
    name: "Social Media Reel",
    data: {
      videoType: "Social Media Reel",
      duration: "15s",
      topic: "Behind-the-scenes look at our team culture",
      keywords: "teamwork, culture, behindthescenes, authentic",
      audience: "Young professionals aged 20-35",
      tone: "Casual",
    },
  },
  {
    name: "Product Demo",
    data: {
      videoType: "Product Demo",
      duration: "90s",
      topic: "Highlighting features and benefits of a new product",
      keywords: "premium, quality, innovative, design",
      audience: "E-commerce shoppers",
      tone: "Persuasive",
    },
  },
  {
    name: "Explainer Video",
    data: {
      videoType: "Explainer Video",
      duration: "120s",
      topic: "Welcoming new users and guiding them through first steps",
      keywords: "welcome, get started, explore, support",
      audience: "New users and first-time customers",
      tone: "Friendly",
    },
  },
];

export default function GeneratePage() {
  const router = useRouter();
  const { provider, apiKey, selectedModel, locale, outputLanguage } = useSettingsStore();
  const t = getTranslations(locale).generate;
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [variations, setVariations] = useState(1);
  const [wordLimit, setWordLimit] = useState(0); // 0 = no limit
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    videoType: "Marketing Video",
    duration: "30s",
    topic: "",
    keywords: "",
    audience: "",
    tone: "Informative",
  });
  const [outputs, setOutputs] = useState<any[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);

  const showToast = (msg: string, type: "error" | "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyTemplate = (template: (typeof TEMPLATES)[number]) => {
    setFormData(template.data);
    setShowTemplates(false);
    showToast(`Template "${template.name}" applied!`, "success");
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      showToast(t.toastApiKey, "error");
      setTimeout(() => router.push("/settings"), 2000);
      return;
    }

    setLoading(true);
    setOutputs([]);
    setActiveTab(0);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          provider,
          apiKey,
          model: selectedModel,
          outputLanguage,
          variations,
          wordLimit: wordLimit > 0 ? wordLimit : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Handle both array and single responses
      const results: any[] = data.results || [data.result];
      setOutputs(results);
      showToast(
        results.length > 1
          ? `${results.length} variations generated successfully!`
          : "Content generated successfully!",
        "success"
      );
    } catch (err: any) {
      showToast(err.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const currentOutput = outputs[activeTab] || null;

  const formatTxtOutput = (out: any) => {
    if (!out) return "";
    let txt = `VIDEO SCRIPT SUMMARY\n`;
    txt += `Title: ${out.title}\n`;
    txt += `Duration: ${formData.duration}\n`;
    txt += `Hook: ${out.hook}\n`;
    txt += `Key Message: ${out.keyMessage}\n`;
    txt += `Call to Action: ${out.callToAction}\n`;
    txt += `\n=========================================\n\n`;

    out.scenes?.forEach((scene: any) => {
      txt += `SCENE ${scene.sceneNumber} — ${scene.title} (${scene.duration})\n`;
      txt += `Visual: ${scene.visualDescription}\n`;
      txt += `Voiceover: ${scene.voiceover || "None"}\n`;
      if (scene.onScreenText) txt += `On-Screen Text: ${scene.onScreenText}\n`;
      if (scene.transition) txt += `Transition: ${scene.transition}\n`;
      if (scene.bgm) txt += `BGM: ${scene.bgm}\n`;
      txt += `\n---\n\n`;
    });
    return txt.trim();
  };

  const handleCopy = () => {
    const formatted = formatTxtOutput(currentOutput);
    if (!formatted) return;
    navigator.clipboard.writeText(formatted);
    showToast(`Variation ${activeTab + 1} copied to clipboard`, "success");
  };

  const handleDownload = () => {
    const formatted = formatTxtOutput(currentOutput);
    if (!formatted) return;
    const blob = new Blob([formatted], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AI_VideoScript_v${activeTab + 1}_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActiveModelName = () => {
    const models = PROVIDER_MODELS[provider];
    const match = models?.find((m) => m.id === selectedModel);
    return match ? `${PROVIDER_LABELS[provider]} — ${match.name}` : `${PROVIDER_LABELS[provider]} — ${selectedModel}`;
  };

  const wordLimitLabel =
    wordLimit === 0 ? "No limit" : `~${wordLimit} words`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 px-1 md:px-0 max-w-7xl mx-auto">
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#1A1A1A] text-white pl-4 pr-3 py-2.5 rounded-full shadow-xl border border-white/10 text-[13px] font-medium animate-in slide-in-from-bottom-4 duration-300 ${
            toast.type === "success"
              ? "bg-[#1A1A1A]"
              : "bg-red-950 border-red-900"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
              AI Content Studio
            </h1>
          </div>
          <p className="text-[14px] text-[var(--color-text-secondary)] tracking-tight">
            Generate high-quality, professional content in seconds.
          </p>
        </div>
        <div className="bg-slate-50 border border-[var(--color-border)] px-3 py-1.5 rounded-full self-start md:self-auto flex items-center gap-2 shadow-sm">
          <span className="text-[var(--color-text-secondary)] text-[11px] uppercase tracking-widest font-bold">
            Engine:
          </span>
          <span className="text-[var(--color-text-primary)] text-[13px] font-semibold tracking-tight">
            {getActiveModelName()}
          </span>
        </div>
      </div>

      {/* ── Templates Panel (overlay) ── */}
      {showTemplates && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm shadow-black/5 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-medium text-[15px] flex items-center gap-2 text-[var(--color-text-primary)]">
                <LayoutTemplate size={16} className="text-[var(--color-text-secondary)] opacity-70" />
                Templates
              </h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[var(--color-text-secondary)]/50 hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TEMPLATES.map((tpl) => {
                const TplIcon = TEMPLATE_ICONS[tpl.name] ?? FileText;
                return (
                  <button
                    key={tpl.name}
                    onClick={() => applyTemplate(tpl)}
                    className="text-left p-4 rounded-xl border border-[var(--color-border)] bg-slate-50/50 hover:border-[var(--color-text-primary)]/20 hover:bg-white hover:shadow-sm transition-all duration-200 ease-out group"
                  >
                    <TplIcon size={14} className="mb-2.5 text-[var(--color-text-primary)] opacity-60 relative top-[-0.5px]" />
                    <p className="font-medium text-[14px] text-[var(--color-text-primary)] transition-colors">
                      {tpl.name}
                    </p>
                    <p className="text-[13px] text-[var(--color-text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                      {tpl.data.topic}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[400px_1fr] gap-8">
        {/* ── Left Column — Form ── */}
        <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm shadow-black/5 p-6 md:p-8 h-fit sticky top-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] opacity-70">
              Configuration
            </span>
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-[var(--color-text-primary)] hover:bg-black/5 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[13px] font-medium transition-colors border border-[var(--color-border)]"
            >
              <LayoutTemplate size={13} className="relative top-[-0.5px]" />
              Templates
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="label">Video Type</label>
              <select
                name="videoType"
                value={formData.videoType}
                onChange={handleChange}
                className="input text-[14px] !py-2.5 !rounded-xl"
              >
                <option>Marketing Video</option>
                <option>Educational Clip</option>
                <option>Social Media Reel</option>
                <option>Product Demo</option>
                <option>Explainer Video</option>
              </select>
            </div>

            <div>
              <label className="label">Duration</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="input text-[14px] !py-2.5 !rounded-xl"
              >
                <option>15s</option>
                <option>30s</option>
                <option>60s</option>
                <option>90s</option>
                <option>120s</option>
              </select>
            </div>

            <div>
              <label className="label">Topic / Subject</label>
              <input
                required
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="input text-[14px] !py-2.5 !rounded-xl"
                placeholder="e.g. The future of AI in web dev"
              />
            </div>

            <div>
              <label className="label">Keywords</label>
              <input
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="input text-[14px] !py-2.5 !rounded-xl"
                placeholder="e.g. Next.js, OpenAI, Web3"
              />
            </div>

            <div>
              <label className="label">Target Audience</label>
              <input
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                className="input text-[14px] !py-2.5 !rounded-xl"
                placeholder="e.g. Senior Developers"
              />
            </div>

            <div>
              <label className="label">Preferred Tone</label>
              <select
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                className="input text-[14px] !py-2.5 !rounded-xl"
              >
                <option>Informative</option>
                <option>Formal</option>
                <option>Casual</option>
                <option>Persuasive</option>
                <option>Friendly</option>
              </select>
            </div>

            {/* ── Advanced Options ── */}
            <div className="border-t border-[var(--color-border)] pt-6 mt-3 space-y-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] opacity-70">
                Advanced
              </p>

              {/* Variations slider */}
              <div>
                <label className="label flex items-center gap-2">
                  <Layers size={13} className="text-[var(--color-text-secondary)] opacity-80" />
                  Variations
                  <span className="ml-auto text-[var(--color-text-primary)] font-bold text-[13px]">
                    {variations}
                  </span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={1}
                  value={variations}
                  onChange={(e) => setVariations(Number(e.target.value))}
                  className="range-slider w-full"
                />
                <div className="flex justify-between text-[11px] font-medium text-[var(--color-text-secondary)]/60 mt-1.5 px-0.5">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                </div>
              </div>

              {/* Word limit slider */}
              <div>
                <label className="label flex items-center gap-2">
                  <AlignLeft size={13} className="text-[var(--color-text-secondary)] opacity-80" />
                  Word Limit
                  <span className="ml-auto text-[var(--color-text-primary)] font-bold text-[13px]">
                    {wordLimitLabel}
                  </span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={50}
                  value={wordLimit}
                  onChange={(e) => setWordLimit(Number(e.target.value))}
                  className="range-slider w-full"
                />
                <div className="flex justify-between text-[11px] font-medium text-[var(--color-text-secondary)]/60 mt-1.5 px-0.5">
                  <span>No limit</span>
                  <span>1000</span>
                  <span>2000</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex justify-center items-center gap-2 mt-4 text-[14px] !rounded-xl shadow-md"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles size={16} /> Generate{" "}
                  {variations > 1 ? `${variations} Variations` : "Content"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Right Column — Output ── */}
        <div className="flex flex-col h-full min-h-[500px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 px-1">
            <h2 className="text-[15px] font-semibold tracking-tight text-[var(--color-text-primary)]">
              Output
            </h2>
            <div className="flex gap-2 font-medium">
              <button
                disabled={!currentOutput}
                onClick={handleCopy}
                className="text-[var(--color-text-secondary)] hover:bg-black/5 hover:text-[var(--color-text-primary)] rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[13px] transition-colors border border-transparent disabled:opacity-50 disabled:pointer-events-none"
                title="Copy to clipboard"
              >
                <Copy size={13} /> Copy
              </button>
              <button
                disabled={!currentOutput}
                onClick={handleDownload}
                className="text-[var(--color-text-secondary)] hover:bg-black/5 hover:text-[var(--color-text-primary)] rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[13px] transition-colors border border-transparent disabled:opacity-50 disabled:pointer-events-none"
                title="Download as .txt"
              >
                <Download size={13} /> Download
              </button>
            </div>
          </div>

          {/* ── Variation Tabs ── */}
          {outputs.length > 1 && (
            <div className="flex flex-wrap gap-1 mb-3 px-1">
              {outputs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-all border ${
                    activeTab === i
                      ? "bg-white text-[var(--color-text-primary)] border-[var(--color-border)] shadow-sm"
                      : "text-[var(--color-text-secondary)] border-transparent hover:text-black hover:bg-black/5"
                  }`}
                >
                  Version {i + 1}
                </button>
              ))}
            </div>
          )}

          <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm shadow-black/5 flex-1 overflow-y-auto w-full p-6 md:p-8 min-h-[500px]">
            {loading ? (
              <div className="space-y-6 animate-pulse mt-2">
                <div className="h-6 bg-slate-100 rounded-md w-1/2"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-slate-100 rounded-md w-full"></div>
                  <div className="h-3 bg-slate-100 rounded-md w-full"></div>
                  <div className="h-3 bg-slate-100 rounded-md w-3/4"></div>
                </div>
                <div className="h-32 bg-slate-100 rounded-md w-full"></div>
                {variations > 1 && (
                  <p className="text-center text-[13px] text-[var(--color-text-secondary)] font-medium animate-pulse mt-8">
                    Generating {variations} variations...
                  </p>
                )}
              </div>
            ) : currentOutput ? (
              <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-50 border border-[var(--color-border)] rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-xl tracking-tight text-[var(--color-text-primary)] mb-4">{currentOutput.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[13px]">
                    <div>
                      <span className="text-[var(--color-text-secondary)] block text-[11px] uppercase font-bold tracking-wider mb-1">Hook</span>
                      <span className="font-medium text-[var(--color-text-primary)] leading-tight block">{currentOutput.hook}</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-secondary)] block text-[11px] uppercase font-bold tracking-wider mb-1">Key Message</span>
                      <span className="font-medium text-[var(--color-text-primary)] leading-tight block">{currentOutput.keyMessage}</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-secondary)] block text-[11px] uppercase font-bold tracking-wider mb-1">CTA</span>
                      <span className="font-medium text-[var(--color-text-primary)] leading-tight block">{currentOutput.callToAction}</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-secondary)] block text-[11px] uppercase font-bold tracking-wider mb-1">Scenes</span>
                      <span className="font-medium text-[var(--color-text-primary)] leading-tight block">{currentOutput.sceneCount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  {currentOutput.scenes?.map((scene: any, idx: number) => (
                    <div key={idx} className="border border-[var(--color-border)] rounded-xl p-5 group hover:border-[var(--color-primary)]/30 transition-colors bg-white hover:bg-slate-50/30">
                      <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-3">
                        <div className="flex items-center gap-3">
                          <span className="bg-black text-white text-[12px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                            Scene {scene.sceneNumber}
                          </span>
                          <span className="font-semibold text-[var(--color-text-primary)]">{scene.title}</span>
                        </div>
                        <span className="text-[12px] font-bold tracking-wide text-[var(--color-text-primary)] bg-slate-100 border border-[var(--color-border)] px-2.5 py-1 rounded-md">
                          {scene.duration}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-4">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                              <Monitor size={12} className="opacity-70" /> Visual
                            </span>
                            <p className="text-[14px] text-[var(--color-text-primary)] leading-relaxed">{scene.visualDescription}</p>
                          </div>
                          {scene.onScreenText && (
                            <div>
                               <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                                 <Type size={12} className="opacity-70" /> On-Screen Text
                               </span>
                               <p className="text-[14px] text-[var(--color-text-primary)] bg-slate-50 border border-[var(--color-border)] rounded-md p-2 font-medium leading-relaxed italic">"{scene.onScreenText}"</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4 border-t md:border-t-0 md:border-l border-[var(--color-border)] pt-4 md:pt-0 md:pl-6">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)] mb-1.5 flex items-center gap-1.5">
                              <Mic size={12} className="opacity-70" /> Voiceover
                            </span>
                            <p className="text-[14px] text-[var(--color-text-primary)] font-medium leading-relaxed border-l-2 border-[var(--color-primary)]/50 pl-2.5 ml-0.5">{scene.voiceover || "No voiceover"}</p>
                          </div>
                          <div className="flex gap-4 pt-1">
                            {scene.transition && (
                              <div>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 block mb-1">Transition</span>
                                <span className="text-[12px] font-medium text-[var(--color-text-primary)] bg-slate-50 border border-[var(--color-border)] rounded px-2 py-0.5">{scene.transition}</span>
                              </div>
                            )}
                            {scene.bgm && (
                              <div>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 block mb-1">Music</span>
                                <span className="text-[12px] font-medium text-[var(--color-text-primary)] bg-slate-50 border border-[var(--color-border)] rounded px-2 py-0.5">{scene.bgm}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <div className="max-w-xs transition-opacity duration-1000 opacity-60">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[var(--color-border)]">
                    <Wand2 size={20} className="text-[var(--color-text-secondary)] opacity-50" />
                  </div>
                  <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                    Set up your configuration on the left to start generating content.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
