"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore, useNotifStore } from "@/stores";
import { logout } from "@/app/actions/auth";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Headphones,
  BookOpen,
  Bot,
  Smartphone,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads & Kontak", icon: Users },
  { href: "/conversations", label: "Percakapan", icon: MessageSquare, badge: "unread" as const },
  { href: "/handoff", label: "Antrian CS", icon: Headphones, badge: "waiting" as const },
  { href: "/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { href: "/ai-settings", label: "AI Settings", icon: Bot },
  { href: "/whatsapp", label: "WhatsApp", icon: Smartphone },
  { href: "/forms", label: "Form Submissions", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const tenant = useAuthStore((s) => s.tenant);
  const { unreadCount, waitingCS } = useNotifStore();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-[var(--color-primary-950)] text-white islamic-pattern-dark"
      style={{ width: "var(--sidebar-width)" }}>
      {/* Logo area */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-700)] flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-lg font-bold tracking-wide text-white leading-tight">
            Aura CRM
          </h1>
          <p className="text-[11px] text-emerald-300/70 truncate">
            {tenant?.name || "Smart WO Platform"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          let badgeValue = 0;
          if (item.badge === "unread") badgeValue = unreadCount;
          if (item.badge === "waiting") badgeValue = waitingCS;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "active bg-white/10 text-[var(--color-gold-400)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {badgeValue > 0 && (
                <span className={cn(
                  "min-w-[20px] h-5 rounded-full text-[11px] font-bold flex items-center justify-center px-1.5",
                  item.badge === "waiting"
                    ? "bg-red-500 text-white badge-bounce"
                    : "bg-[var(--color-gold-500)] text-white"
                )}>
                  {badgeValue}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:bg-white/5 hover:text-white/80 transition-all"
        >
          <Settings className="w-[18px] h-[18px]" />
          <span>Settings</span>
        </Link>
        <form action={logout}>
          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut className="w-[18px] h-[18px]" />
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
