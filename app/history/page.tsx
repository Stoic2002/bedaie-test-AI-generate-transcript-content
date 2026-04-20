"use client";

import { useEffect, useState } from "react";
import { getHistory, deleteHistoryItem } from "@/app/actions/history";
import { Trash2, Search, Loader2, ChevronDown, Clock, Tag, MessageSquare, Sparkles, Undo2, Monitor, Mic, Type } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getTranslations } from "@/lib/i18n";

type Generation = {
  id: string;
  videoType: string;
  duration: string;
  topic: string;
  tone: string | null;
  outputScript: string;
  outputScenes: any;
  sceneCount: number;
  createdAt: Date;
};

export default function HistoryPage() {
  const { locale } = useSettingsStore();
  const t = getTranslations(locale).history;
  const [history, setHistory] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [undoItem, setUndoItem] = useState<Generation | null>(null);
  const [undoTimer, setUndoTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getHistory();
      // Server actions return Date objects preserved properly
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Cancel any existing undo timer
    if (undoTimer) clearTimeout(undoTimer);

    const itemToDelete = history.find((item) => item.id === id);
    if (!itemToDelete) return;

    // Optimistic removal
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (expandedId === id) setExpandedId(null);
    setUndoItem(itemToDelete);

    // Auto-commit delete after 4 seconds
    const timer = setTimeout(async () => {
      setUndoItem(null);
      try {
        await deleteHistoryItem(id);
      } catch {
        fetchData();
      }
    }, 4000);
    setUndoTimer(timer);
  };

  const handleUndo = () => {
    if (!undoItem || !undoTimer) return;
    clearTimeout(undoTimer);
    setUndoTimer(null);
    // Restore item to list in original position
    setHistory((prev) => {
      const restored = [...prev, undoItem].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return restored;
    });
    setUndoItem(null);
  };

  const filteredHistory = history.filter((item) => {
    const term = search.toLowerCase();
    return item.topic.toLowerCase().includes(term) || item.videoType.toLowerCase().includes(term);
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 px-1 md:px-0 max-w-5xl mx-auto">
      {/* ── Undo Delete Toast ── */}
      {undoItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#1A1A1A] text-white pl-4 pr-3 py-2.5 rounded-full shadow-xl border border-white/10 text-[13px] font-medium animate-in slide-in-from-bottom-4 duration-300">
          <span className="truncate max-w-[200px] text-white/90">{t.deleted} "{undoItem.topic}"</span>
          <button
            onClick={handleUndo}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-full transition-colors shrink-0"
          >
            <Undo2 size={12} />
            {t.undo}
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-1.5">{t.title}</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">{t.subtitle}</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]/50" size={15} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] text-[14px] rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all shadow-sm placeholder:text-[var(--color-text-secondary)]/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-24">
          <Loader2 className="animate-spin text-[var(--color-primary)] opacity-20" size={32} />
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="w-12 h-12 bg-white border border-[var(--color-border)] rounded-xl flex items-center justify-center mb-4 shadow-sm shadow-black/5">
            <Clock size={20} className="text-[var(--color-text-secondary)]/40" />
          </div>
          <h3 className="text-[15px] font-medium text-[var(--color-text-primary)] mb-1">No history yet</h3>
          <p className="text-[13px] text-[var(--color-text-secondary)]">Generated content will appear here.</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="w-12 h-12 bg-white border border-[var(--color-border)] rounded-xl flex items-center justify-center mb-4 shadow-sm shadow-black/5">
            <Search size={20} className="text-[var(--color-text-secondary)]/40" />
          </div>
          <h3 className="text-[15px] font-medium text-[var(--color-text-primary)] mb-1">No results found</h3>
          <p className="text-[13px] text-[var(--color-text-secondary)]">We couldn't find anything matching "{search}".</p>
        </div>
      ) : (
        <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm shadow-black/5">
          <div className="divide-y divide-[var(--color-border)] flex flex-col">
            {filteredHistory.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`cursor-pointer transition-colors duration-200 ease-out group ${isExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50/50'}`}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="px-5 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[15px] text-[var(--color-text-primary)] mb-1.5 truncate group-hover:text-[var(--color-primary)] transition-colors">{item.topic || item.outputScenes?.title || "Untitled Script"}</h3>
                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-[13px]">
                          <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] font-medium">
                            <Tag size={12} className="relative top-[-0.5px] opacity-70" />
                            {item.videoType}
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                            <Clock size={12} className="opacity-70 relative top-[-0.5px]" />
                            {item.duration}
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                            <MessageSquare size={12} className="opacity-70 relative top-[-0.5px]" />
                            {item.sceneCount} {t.scenes}
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]/70">
                            {new Date(item.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center opacity-100 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--color-text-secondary)]/50 hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-destructive)]/50"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                        <div className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-200 ${isExpanded ? 'text-[var(--color-text-primary)] bg-[var(--color-border)]' : 'text-[var(--color-text-secondary)]/70 hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)]'}`}>
                          <ChevronDown size={15} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && item.outputScenes && (
                    <div className="px-5 pb-6 pt-1 animate-in flex flex-col slide-in-from-top-1 duration-200 ease-out">
                      <div className="pl-0 sm:pl-4 sm:border-l-2 border-[var(--color-border)] sm:ml-1 mt-2">
                        
                        <div className="bg-slate-50 border border-[var(--color-border)] rounded-xl p-5 shadow-sm mb-4">
                          <h3 className="font-semibold text-xl tracking-tight text-[var(--color-text-primary)] mb-4">{item.outputScenes.title}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
                            <div>
                              <span className="text-[var(--color-text-secondary)] block text-[11px] uppercase font-bold tracking-wider mb-1">Hook</span>
                              <span className="font-medium text-[var(--color-text-primary)] leading-tight block">{item.outputScenes.hook}</span>
                            </div>
                            <div>
                              <span className="text-[var(--color-text-secondary)] block text-[11px] uppercase font-bold tracking-wider mb-1">Key Message</span>
                              <span className="font-medium text-[var(--color-text-primary)] leading-tight block">{item.outputScenes.keyMessage}</span>
                            </div>
                            <div>
                              <span className="text-[var(--color-text-secondary)] block text-[11px] uppercase font-bold tracking-wider mb-1">CTA</span>
                              <span className="font-medium text-[var(--color-text-primary)] leading-tight block">{item.outputScenes.callToAction}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          {item.outputScenes.scenes?.map((scene: any, idx: number) => (
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

