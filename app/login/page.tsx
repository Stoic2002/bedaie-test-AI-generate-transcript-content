"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Wand2 } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getTranslations } from "@/lib/i18n";
import { useToast } from "@/contexts/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { locale } = useSettingsStore();
  const t = getTranslations(locale).auth;
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex bg-[var(--color-background)] min-h-screen items-center justify-center p-4 selection:bg-slate-200 selection:text-black">
      <div className="w-full max-w-[380px]">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-white border border-[var(--color-border)] shadow-sm shadow-black/5 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
            <Wand2 className="w-5 h-5 text-[var(--color-text-primary)]" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            {t.loginTitle}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-[14px]">
            {t.loginSubtitle}
          </p>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-sm shadow-black/5">

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">{t.emailLabel}</label>
              <input
                id="email" type="email"
                className="input text-[14px] !py-2.5 !rounded-xl"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">{t.passwordLabel}</label>
              <input
                id="password" type="password"
                className="input text-[14px] !py-2.5 !rounded-xl"
                value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary w-full flex justify-center mt-2 py-2.5 !rounded-xl" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.loginBtn}
            </button>
          </form>
        </div>

        <p className="text-center text-[var(--color-text-secondary)] mt-8 text-[14px]">
          {t.noAccount}{" "}
          <Link href="/register" className="text-[var(--color-text-primary)] font-medium hover:underline underline-offset-4 decoration-[var(--color-border)] transition-colors">
            {t.createOne}
          </Link>
        </p>
      </div>
    </div>
  );
}
