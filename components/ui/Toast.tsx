"use client";

import React from "react";
import { useToast } from "@/contexts/ToastContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const Toaster = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onRemove }: { toast: any; onRemove: () => void }) => {
  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={18} />,
    error: <AlertCircle className="text-rose-500" size={18} />,
    info: <Info className="text-blue-500" size={18} />,
  };

  const bgStyles = {
    success: "bg-emerald-50 border-emerald-100",
    error: "bg-rose-50 border-rose-100",
    info: "bg-blue-50 border-blue-100",
  };

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl border shadow-lg shadow-black/5
        animate-in slide-in-from-right-4 fade-in duration-300 min-w-[280px] max-w-md
        ${bgStyles[toast.type as keyof typeof bgStyles]}
      `}
    >
      <div className="shrink-0">{icons[toast.type as keyof typeof icons]}</div>
      <p className="text-[14px] font-medium text-slate-800 flex-1 leading-tight">
        {toast.message}
      </p>
      <button
        onClick={onRemove}
        className="p-1 hover:bg-black/5 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};
