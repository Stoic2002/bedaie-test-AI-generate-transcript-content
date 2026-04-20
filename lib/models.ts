export type AIProvider = "openai" | "gemini" | "claude" | "openrouter";

export interface ModelOption {
  id: string;
  name: string;
  description: string;
}

export const PROVIDER_MODELS: Record<AIProvider, ModelOption[]> = {
  openai: [
    {
      id: "gpt-5.4-mini",
      name: "GPT-5.4 Mini",
      description: "Fast & cost-effective — coding, subagents",
    },
    {
      id: "gpt-5.4",
      name: "GPT-5.4",
      description: "Flagship — complex reasoning & coding",
    },
    {
      id: "gpt-5.4-nano",
      name: "GPT-5.4 Nano",
      description: "Budget — high-volume simple tasks",
    },
  ],
  gemini: [
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      description: "Stable GA — best price-performance with reasoning",
    },
    {
      id: "gemini-2.5-pro",
      name: "Gemini 2.5 Pro",
      description: "GA — complex tasks, deep reasoning",
    },
    {
      id: "gemini-3-flash-preview",
      name: "Gemini 3 Flash (Preview)",
      description: "Frontier-class, rivaling larger models",
    },
    {
      id: "gemini-3.1-pro-preview",
      name: "Gemini 3.1 Pro (Preview)",
      description: "Terbaru — advanced reasoning, agentic coding",
    },
    {
      id: "gemini-3.1-flash-lite-preview",
      name: "Gemini 3.1 Flash-Lite (Preview)",
      description: "Budget ultra-cepat",
    },
  ],
  claude: [
    {
      id: "claude-sonnet-4-6",
      name: "Claude Sonnet 4.6",
      description: "Balanced — best speed + intelligence ratio",
    },
    {
      id: "claude-opus-4-7",
      name: "Claude Opus 4.7",
      description: "Flagship — complex reasoning, agentic coding",
    },
    {
      id: "claude-haiku-4-5-20251001",
      name: "Claude Haiku 4.5",
      description: "Fastest — high-volume, real-time tasks",
    },
  ],
  openrouter: [
    {
      id: "google/gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      description: "Google — fast, cost-effective reasoning",
    },
    {
      id: "anthropic/claude-sonnet-4-6",
      name: "Claude Sonnet 4.6",
      description: "Anthropic — balanced speed & intelligence",
    },
    {
      id: "openai/gpt-5.4-mini",
      name: "GPT-5.4 Mini",
      description: "OpenAI — fast coding, subagents",
    },
    {
      id: "meta-llama/llama-4-maverick",
      name: "Llama 4 Maverick",
      description: "Meta — open-source frontier model",
    },
    {
      id: "deepseek/deepseek-r1",
      name: "DeepSeek R1",
      description: "DeepSeek — advanced reasoning",
    },
  ],
};

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: "gpt-5.4-mini",
  gemini: "gemini-2.5-flash",
  claude: "claude-sonnet-4-6",
  openrouter: "google/gemini-2.5-flash",
};

export const PROVIDER_LABELS: Record<AIProvider, string> = {
  openai: "OpenAI",
  gemini: "Google Gemini",
  claude: "Anthropic Claude",
  openrouter: "OpenRouter (300+ Models)",
};
