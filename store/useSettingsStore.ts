import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AIProvider, DEFAULT_MODELS } from '@/lib/models';
import { type Locale } from '@/lib/i18n';

export type { AIProvider };

interface SettingsState {
  provider: AIProvider;
  apiKey: string;
  selectedModel: string;
  customOpenRouterModel: string;
  isSidebarCollapsed: boolean;
  locale: Locale;
  outputLanguage: Locale;
  setProvider: (provider: AIProvider) => void;
  setApiKey: (key: string) => void;
  setSelectedModel: (model: string) => void;
  setCustomOpenRouterModel: (model: string) => void;
  toggleSidebar: () => void;
  setLocale: (locale: Locale) => void;
  setOutputLanguage: (lang: Locale) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      provider: 'gemini',
      apiKey: '',
      selectedModel: DEFAULT_MODELS.gemini,
      customOpenRouterModel: '',
      isSidebarCollapsed: false,
      locale: 'en',
      outputLanguage: 'en',
      setProvider: (provider) =>
        set({ provider, selectedModel: DEFAULT_MODELS[provider] }),
      setApiKey: (apiKey) => set({ apiKey }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      setCustomOpenRouterModel: (customOpenRouterModel) => set({ customOpenRouterModel }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setLocale: (locale) => set({ locale }),
      setOutputLanguage: (outputLanguage) => set({ outputLanguage }),
    }),
    {
      name: 'ai-content-generator-settings',
    }
  )
);
