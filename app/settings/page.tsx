"use client";

import { useState, useEffect } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { PROVIDER_MODELS, PROVIDER_LABELS, DEFAULT_MODELS, type AIProvider } from "@/lib/models";
import { LOCALE_LABELS, OUTPUT_LANGUAGE_LABELS, type Locale, getTranslations } from "@/lib/i18n";
import { Check, Eye, EyeOff, Lock, ExternalLink, Globe } from "lucide-react";

export default function SettingsPage() {
  const {
    provider, apiKey, selectedModel, customOpenRouterModel,
    locale, outputLanguage,
    setProvider, setApiKey, setSelectedModel, setCustomOpenRouterModel,
    setLocale, setOutputLanguage,
  } = useSettingsStore();

  const t = getTranslations(locale).settings;

  const [localKey, setLocalKey] = useState(apiKey);
  const [localProvider, setLocalProvider] = useState<AIProvider>(provider);
  const [localModel, setLocalModel] = useState(selectedModel);
  const [localCustomModel, setLocalCustomModel] = useState(customOpenRouterModel);
  const [localLocale, setLocalLocale] = useState<Locale>(locale);
  const [localOutputLang, setLocalOutputLang] = useState<Locale>(outputLanguage);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocalKey(apiKey);
    setLocalProvider(provider);
    setLocalModel(selectedModel);
    setLocalCustomModel(customOpenRouterModel);
    setLocalLocale(locale);
    setLocalOutputLang(outputLanguage);
  }, [apiKey, provider, selectedModel, customOpenRouterModel, locale, outputLanguage]);

  const handleProviderChange = (newProvider: AIProvider) => {
    setLocalProvider(newProvider);
    setLocalModel(DEFAULT_MODELS[newProvider]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProvider(localProvider);
    setApiKey(localKey);
    setLocale(localLocale);
    setOutputLanguage(localOutputLang);
    if (localProvider === "openrouter" && localCustomModel.trim()) {
      setSelectedModel(localCustomModel.trim());
      setCustomOpenRouterModel(localCustomModel.trim());
    } else {
      setSelectedModel(localModel);
      setCustomOpenRouterModel("");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getMaskedKey = (key: string) => {
    if (!key) return "No key saved";
    if (key.length <= 8) return "*".repeat(key.length);
    return `${key.slice(0, 3)}...${key.slice(-4)}`;
  };

  const apiKeyLinks: Record<AIProvider, { label: string; url: string }> = {
    openai: { label: "platform.openai.com", url: "https://platform.openai.com/api-keys" },
    gemini: { label: "aistudio.google.com", url: "https://aistudio.google.com/apikey" },
    claude: { label: "console.anthropic.com", url: "https://console.anthropic.com/settings/keys" },
    openrouter: { label: "openrouter.ai", url: "https://openrouter.ai/keys" },
  };

  if (!mounted) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto px-1 md:px-0">
      <div className="flex items-center gap-2.5 mb-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">{t.title}</h1>
      </div>
      <p className="text-[14px] text-[var(--color-text-secondary)] mb-8 tracking-tight">{t.subtitle}</p>

      <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm shadow-black/5 p-6 md:p-8 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-8">

          {/* ── Provider ── */}
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1">{t.providerLabel}</h2>
            <p className="text-[14px] text-[var(--color-text-secondary)] mb-4">{t.providerSubtitle}</p>
            <select
              title="Select AI Provider"
              value={localProvider}
              onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
              className="input w-full !text-[14px] !rounded-xl"
            >
              {(Object.keys(PROVIDER_LABELS) as AIProvider[]).map((key) => (
                <option key={key} value={key}>{PROVIDER_LABELS[key]}</option>
              ))}
            </select>
          </div>

          {/* ── Model ── */}
          <div className="animate-in slide-in-from-top-2 duration-300">
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1">{t.modelLabel}</h2>
            <p className="text-[14px] text-[var(--color-text-secondary)] mb-4 leading-relaxed">{t.modelSubtitle}</p>
            <div className="space-y-2">
              {PROVIDER_MODELS[localProvider].map((model) => (
                <label
                  key={model.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    localModel === model.id
                      ? "border-[var(--color-text-primary)] bg-slate-50 shadow-sm"
                      : "border-[var(--color-border)] hover:border-[var(--color-text-secondary)]/30 hover:bg-slate-50/50"
                  }`}
                >
                  <input
                    type="radio" name="model" value={model.id}
                    checked={localModel === model.id}
                    onChange={() => { setLocalModel(model.id); if (localProvider === "openrouter") setLocalCustomModel(""); }}
                    className="mt-0.5 accent-black"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] font-semibold text-[var(--color-text-primary)] block">{model.name}</span>
                    <span className="text-[13px] text-[var(--color-text-secondary)] block mt-0.5 leading-snug">{model.description}</span>
                    <code className="text-[11px] text-[var(--color-text-secondary)]/60 font-mono mt-1 block">{model.id}</code>
                  </div>
                </label>
              ))}
            </div>

            {localProvider === "openrouter" && (
              <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[13px] font-semibold text-[var(--color-text-primary)] block mb-2">{t.customModelLabel}</label>
                <input
                  type="text" value={localCustomModel}
                  onChange={(e) => { setLocalCustomModel(e.target.value); if (e.target.value.trim()) setLocalModel(""); }}
                  placeholder={t.customModelPlaceholder}
                  className="input w-full !text-[14px] !rounded-xl"
                />
                <p className="text-[12px] text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                  {t.customModelHint}{" "}
                  <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer"
                    className="text-black font-medium hover:underline underline-offset-2 inline-flex items-center gap-1">
                    openrouter.ai/models <ExternalLink size={11} />
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* ── API Key ── */}
          <div className="pt-6 border-t border-[var(--color-border)] mt-2">
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1">{t.apiKeyLabel}</h2>
            <div className="flex gap-2.5 items-start p-3.5 bg-slate-50 border border-[var(--color-border)] rounded-xl mb-5">
              <Lock size={15} className="mt-0.5 shrink-0 text-[var(--color-text-secondary)] opacity-70" />
              <div className="text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                <p>{t.apiKeyPrivacy}</p>
                <p className="mt-1.5">
                  {t.apiKeyGetFrom}{" "}
                  <a href={apiKeyLinks[localProvider].url} target="_blank" rel="noopener noreferrer"
                    className="text-black font-medium hover:underline underline-offset-2 inline-flex items-center gap-1">
                    {apiKeyLinks[localProvider].label} <ExternalLink size={11} />
                  </a>
                </p>
              </div>
            </div>
            <div className="relative w-full">
              <input
                type={showKey ? "text" : "password"} value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                placeholder={`${PROVIDER_LABELS[localProvider]} API Key`}
                className="input w-full !text-[14px] !rounded-xl pr-10"
              />
              <button type="button" onClick={() => setShowKey(!showKey)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]/50 hover:text-[var(--color-text-primary)] transition-colors focus:outline-none">
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {apiKey && apiKey === localKey && (
              <p className="text-[13px] text-emerald-600 mt-2.5 flex items-center gap-1.5 font-medium">
                <Check size={14} /> {t.apiKeySaved} {getMaskedKey(apiKey)}
              </p>
            )}
          </div>

          {/* ── Language ── */}
          <div className="pt-6 border-t border-[var(--color-border)] mt-2">
            <div className="flex items-center gap-2 mb-1">
              <Globe size={16} className="text-[var(--color-text-secondary)]" />
              <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{t.languageSection}</h2>
            </div>
            <p className="text-[14px] text-[var(--color-text-secondary)] mb-6 leading-relaxed">{t.languageSectionSubtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[13px] font-semibold text-[var(--color-text-primary)] block mb-1.5">{t.uiLanguageLabel}</label>
                <p className="text-[12px] text-[var(--color-text-secondary)] mb-3 leading-snug">{t.uiLanguageSubtitle}</p>
                <select title="UI Language" value={localLocale}
                  onChange={(e) => setLocalLocale(e.target.value as Locale)}
                  className="input w-full !text-[14px] !rounded-xl">
                  {(Object.entries(LOCALE_LABELS) as [Locale, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--color-text-primary)] block mb-1.5">{t.outputLanguageLabel}</label>
                <p className="text-[12px] text-[var(--color-text-secondary)] mb-3 leading-snug">{t.outputLanguageSubtitle}</p>
                <select title="Output Language" value={localOutputLang}
                  onChange={(e) => setLocalOutputLang(e.target.value as Locale)}
                  className="input w-full !text-[14px] !rounded-xl">
                  {(Object.entries(OUTPUT_LANGUAGE_LABELS) as [Locale, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Save ── */}
          <div className="pt-6 border-t border-[var(--color-border)] mt-2 flex items-center gap-4">
            <button type="submit" className="btn-primary !rounded-xl">{t.saveBtn}</button>
            {saved && (
              <span className="text-emerald-600 text-[14px] animate-in slide-in-from-left-2 fade-in duration-300 font-medium">
                {t.savedMsg}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
