"use client";

import { useState, useMemo, useEffect } from "react";
import { getFormSubmissions } from "@/app/actions/crm";
import { formatPhone, relativeTime } from "@/lib/utils";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Users,
  Calendar,
  MapPin,
  Loader2,
} from "lucide-react";

const TABS = [
  { label: "Semua", value: "ALL" },
  { label: "Belum Diproses", value: "UNPROCESSED" },
  { label: "Sudah Diproses", value: "PROCESSED" },
];

export default function FormSubmissionsPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    getFormSubmissions()
      .then((data) => setForms(data as any[]))
      .catch(() => setForms([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let data = [...forms];
    if (activeTab === "UNPROCESSED") data = data.filter((f) => !f.isProcessed);
    if (activeTab === "PROCESSED") data = data.filter((f) => f.isProcessed);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (f) =>
          (f.contactName || "").toLowerCase().includes(q) ||
          (f.phoneNumber || "").includes(q)
      );
    }
    return data;
  }, [activeTab, search, forms]);

  const unprocessedCount = forms.filter((f) => !f.isProcessed).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-[var(--color-muted)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">
            Form Submissions
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Data dari form website yang dikirim oleh customer
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unprocessedCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              {unprocessedCount} belum diproses
            </span>
          )}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--color-border)] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center bg-[var(--color-bg)] rounded-lg p-1">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.value
                    ? "bg-white shadow-sm text-[var(--color-text)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau nomor..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((form) => (
          <div key={form.id} className="bg-white rounded-xl border border-[var(--color-border)] p-5 card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] flex items-center justify-center text-white text-sm font-bold">
                  {(form.contactName || "UN").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">{form.contactName || "Unknown"}</p>
                  <p className="text-xs text-[var(--color-muted)]">{formatPhone(form.phoneNumber || "")}</p>
                </div>
              </div>
              {form.isProcessed ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Done
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  Pending
                </span>
              )}
            </div>

            <div className="space-y-2 bg-[var(--color-bg)] rounded-lg p-3">
              {[
                { icon: Calendar, label: "Jenis & Tanggal", value: `${form.eventType || "-"} • ${form.eventDate ? new Date(form.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}` },
                { icon: MapPin, label: "Lokasi", value: `${form.location || "-"} — ${form.venueName || "-"}` },
                { icon: Users, label: "Estimasi Tamu", value: `${(form.guestCount || 0).toLocaleString()} orang` },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5 text-[var(--color-muted)] flex-shrink-0" />
                  <p className="text-xs text-[var(--color-text)]">
                    <span className="text-[var(--color-muted)]">{item.label}: </span>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-muted)]">{relativeTime(form.submittedAt)}</span>
              {!form.isProcessed && (
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white text-xs font-semibold rounded-lg transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Proses
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <FileText className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-sm text-[var(--color-muted)]">Tidak ada form submission</p>
          </div>
        )}
      </div>
    </div>
  );
}
