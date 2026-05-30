"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores";
import {
  Settings,
  Building2,
  User,
  Globe,
  Bell,
  Shield,
  Save,
  Camera,
  CheckCircle2,
  ChevronRight,
  LogOut,
  CreditCard,
} from "lucide-react";

type SettingsTab = "company" | "profile" | "billing" | "notifications";

const TABS: { label: string; value: SettingsTab; icon: typeof Building2 }[] = [
  { label: "Perusahaan", value: "company", icon: Building2 },
  { label: "Profil", value: "profile", icon: User },
  { label: "Billing", value: "billing", icon: CreditCard },
  { label: "Notifikasi", value: "notifications", icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("company");
  const { user, tenant } = useAuthStore();

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">
          Settings
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Atur preferensi akun dan perusahaan Anda
        </p>
      </div>

      <div className="flex gap-6">
        {/* Tab Navigation */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-[var(--color-border)] last:border-0 ${
                  activeTab === tab.value
                    ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                    : "text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "company" && <CompanyTab tenant={tenant} />}
          {activeTab === "profile" && <ProfileTab user={user} />}
          {activeTab === "billing" && <BillingTab tenant={tenant} />}
          {activeTab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
}

function CompanyTab({ tenant }: { tenant: any }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-[var(--color-text)]">Informasi Perusahaan</h2>
          <p className="text-xs text-[var(--color-muted)]">Detail bisnis Anda yang muncul di chat</p>
        </div>
      </div>

      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Nama Perusahaan</label>
          <input
            type="text"
            defaultValue={tenant?.name || "Wina Al-Husna Wedding & Catering"}
            className="w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Slug (URL Webhook)</label>
          <input
            type="text"
            defaultValue={tenant?.slug || "wina-crm"}
            className="w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all font-mono"
          />
          <p className="text-[11px] text-[var(--color-muted)] mt-1">Digunakan untuk URL: /api/webhook/[slug]</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Jenis Bisnis</label>
          <select className="w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all">
            <option value="wedding">Wedding</option>
            <option value="catering">Catering</option>
            <option value="event">Event Organizer</option>
            <option value="combined">Wedding & Catering</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white text-sm font-semibold rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          Simpan
        </button>
      </div>
    </div>
  );
}

function ProfileTab({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-primary-800)] flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {user?.name?.charAt(0) || "U"}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Camera className="w-3.5 h-3.5 text-[var(--color-muted)]" />
            </button>
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--color-text)]">{user?.name || "User"}</p>
            <p className="text-xs text-[var(--color-muted)]">{user?.email || "email@example.com"}</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-4">Edit Profil</h2>
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              defaultValue={user?.name || ""}
              className="w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Email</label>
            <input
              type="email"
              defaultValue={user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-[var(--color-border)] rounded-lg text-[var(--color-muted)] cursor-not-allowed"
            />
            <p className="text-[11px] text-[var(--color-muted)] mt-1">Email tidak dapat diubah</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Role</label>
            <input
              type="text"
              defaultValue={user?.role || "AGENT"}
              disabled
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-[var(--color-border)] rounded-lg text-[var(--color-muted)] cursor-not-allowed"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white text-sm font-semibold rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

function BillingTab({ tenant }: { tenant: any }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-[var(--color-text)]">Billing & Plan</h2>
          <p className="text-xs text-[var(--color-muted)]">Kelola langganan Anda</p>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-r from-[var(--color-primary-50)] to-blue-50 rounded-xl border border-[var(--color-primary-100)] mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary-700)]">Current Plan</p>
            <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{tenant?.planTier || "FREE"}</p>
          </div>
          <button className="px-4 py-2 bg-[var(--color-primary-600)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--color-primary-700)] transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { feature: "WhatsApp Integration", free: true, starter: true, pro: true },
          { feature: "AI Auto-Reply", free: true, starter: true, pro: true },
          { feature: "Knowledge Base", free: "5 docs", starter: "50 docs", pro: "Unlimited" },
          { feature: "CS Handoff", free: false, starter: true, pro: true },
          { feature: "Analytics", free: false, starter: true, pro: true },
          { feature: "Multi-User", free: false, starter: "3 users", pro: "Unlimited" },
          { feature: "Custom AI Persona", free: false, starter: false, pro: true },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors">
            <span className="text-sm font-medium text-[var(--color-text)]">{item.feature}</span>
            <div className="flex items-center gap-8">
              <span className="text-xs text-[var(--color-muted)] w-16 text-center">
                {typeof item.free === "boolean"
                  ? item.free ? <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /> : "—"
                  : item.free}
              </span>
              <span className="text-xs text-[var(--color-muted)] w-16 text-center">
                {typeof item.starter === "boolean"
                  ? item.starter ? <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /> : "—"
                  : item.starter}
              </span>
              <span className="text-xs text-[var(--color-muted)] w-16 text-center">
                {typeof item.pro === "boolean"
                  ? item.pro ? <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /> : "—"
                  : item.pro}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    newLead: true,
    handoff: true,
    messageResponse: false,
    weeklyReport: true,
    marketingEmail: false,
  });

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
          <Bell className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-[var(--color-text)]">Notifikasi</h2>
          <p className="text-xs text-[var(--color-muted)]">Pilih notifikasi yang ingin Anda terima</p>
        </div>
      </div>

      <div className="space-y-1 max-w-lg">
        {[
          { key: "newLead" as const, label: "Lead Baru", desc: "Notifikasi saat ada lead baru dari form website" },
          { key: "handoff" as const, label: "CS Handoff", desc: "Notifikasi saat customer meminta CS manusia" },
          { key: "messageResponse" as const, label: "Respons AI", desc: "Notifikasi setiap AI mengirim respons" },
          { key: "weeklyReport" as const, label: "Laporan Mingguan", desc: "Ringkasan performa setiap minggu" },
          { key: "marketingEmail" as const, label: "Email Marketing", desc: "Tips dan update dari Wina CRM" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors">
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">{item.label}</p>
              <p className="text-xs text-[var(--color-muted)]">{item.desc}</p>
            </div>
            <button
              onClick={() => setPrefs({ ...prefs, [item.key]: !prefs[item.key] })}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                prefs[item.key] ? "bg-[var(--color-primary-600)]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  prefs[item.key] ? "translate-x-[18px]" : "translate-x-[2px]"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
