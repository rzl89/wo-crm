"use client";

import { useAuthStore, useNotifStore } from "@/stores";
import { getInitials } from "@/lib/utils";
import { Bell, Search, Headphones } from "lucide-react";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const { unreadCount, waitingCS } = useNotifStore();

  return (
    <header
      className="fixed top-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]"
      style={{
        left: "var(--sidebar-width)",
        height: "var(--header-height)",
      }}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Cari lead, percakapan, dokumen..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all placeholder:text-[var(--color-muted)]"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* CS Queue alert */}
          {waitingCS > 0 && (
            <button className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-all">
              <Headphones className="w-3.5 h-3.5" />
              <span>{waitingCS} Antrian CS</span>
            </button>
          )}

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-[var(--color-bg)] transition-all">
            <Bell className="w-5 h-5 text-[var(--color-muted)]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[var(--color-waiting)] text-white text-[10px] font-bold rounded-full flex items-center justify-center badge-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-[var(--color-border)]" />

          {/* User avatar */}
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-primary-800)] flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {user ? getInitials(user.name) : "?"}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-[var(--color-text)] leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-[var(--color-muted)]">
                {user?.role || "Agent"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
