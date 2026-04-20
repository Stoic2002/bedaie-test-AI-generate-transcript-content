"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  PenSquare,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getTranslations } from "@/lib/i18n";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSidebarCollapsed, toggleSidebar, locale } = useSettingsStore();
  const t = getTranslations(locale).nav;

  const links = [
    { name: t.generate, href: "/", icon: PenSquare },
    { name: t.history, href: "/history", icon: History },
    { name: t.settings, href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-background)]">
        <div className="flex items-center gap-2">
          <Wand2 size={18} className="text-[var(--color-text-primary)]" />
          <span className="font-semibold tracking-tight text-[15px]">{t.appName}</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[61px] left-0 right-0 bg-[var(--color-background)] border-b border-[var(--color-border)] z-50 p-4 flex gap-2 flex-col shadow-sm">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-black/5 text-[var(--color-text-primary)] font-medium"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5"
                }`}
              >
                <link.icon size={18} />
                <span className="text-[14px]">{link.name}</span>
              </Link>
            );
          })}

          <div className="mt-2 pt-4 border-t border-[var(--color-border)]">
            <p className="text-[13px] font-medium text-[var(--color-text-primary)] mb-3 truncate px-2">
              {session?.user?.name || session?.user?.email}
            </p>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 p-3 w-full rounded-xl text-[var(--color-text-secondary)] hover:text-black hover:bg-black/5 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-[14px]">{t.signOut}</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col border-r border-[var(--color-border)] bg-[var(--color-background)] sticky top-0 h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className={`flex items-center h-[73px] border-b border-[var(--color-border)] transition-all ${isSidebarCollapsed ? "justify-center px-4" : "px-6"}`}>
          <div className="flex items-center gap-2.5">
            <Wand2 size={18} className="text-[var(--color-text-primary)] shrink-0" />
            {!isSidebarCollapsed && (
              <h2 className="font-semibold text-[15px] tracking-tight text-[var(--color-text-primary)] whitespace-nowrap animate-in fade-in">
                {t.appName}
              </h2>
            )}
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto py-6 flex flex-col gap-1 transition-all ${isSidebarCollapsed ? "px-3" : "px-4"}`}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center rounded-xl transition-all duration-200 ease-out relative group ${
                  isSidebarCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-black/5 text-[var(--color-text-primary)] font-medium"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5"
                }`}
              >
                <link.icon size={16} className="shrink-0 relative top-[-0.5px]" />
                {!isSidebarCollapsed && (
                  <span className="text-[14px] tracking-tight whitespace-nowrap">{link.name}</span>
                )}
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-black text-white text-[12px] font-medium tracking-wide rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
                    {link.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className={`p-4 border-t border-[var(--color-border)] transition-all ${isSidebarCollapsed ? "px-3" : "px-4"}`}>
          {!isSidebarCollapsed && (
            <div className="mb-4 px-2">
              <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">{session?.user?.name}</p>
              <p className="text-[12px] text-[var(--color-text-secondary)] truncate">{session?.user?.email}</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={`flex items-center rounded-xl text-[var(--color-text-secondary)] hover:text-black transition-all group relative ${
                isSidebarCollapsed ? "justify-center p-3 hover:bg-black/5" : "gap-3 px-3 py-2 w-full hover:bg-black/5"
              }`}
            >
              <LogOut size={16} className="shrink-0" />
              {!isSidebarCollapsed && <span className="text-[14px] font-medium">{t.signOut}</span>}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-black text-white text-[12px] font-medium tracking-wide rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
                  {t.signOut}
                </div>
              )}
            </button>

            <button
              onClick={() => toggleSidebar()}
              className={`flex items-center rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 transition-all group relative ${
                isSidebarCollapsed ? "justify-center p-3 mt-1" : "gap-3 px-3 py-2 w-full mt-1"
              }`}
            >
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              {!isSidebarCollapsed && <span className="text-[14px] font-medium">{t.collapse}</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
