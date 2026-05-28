"use client";

import { useState, useMemo } from "react";
import { mockLeads, type Stage } from "@/lib/mock-data";
import { formatPhone, relativeTime } from "@/lib/utils";
import { StageBadge } from "@/components/shared/Badges";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  MessageSquare,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

const TABS: { label: string; value: Stage | "ALL" }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Leads", value: "LEADS" },
  { label: "Meeting", value: "MEETING" },
  { label: "Closing", value: "CLOSING" },
];

const PAGE_SIZE = 8;

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<Stage | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let data = [...mockLeads];
    if (activeTab !== "ALL") {
      data = data.filter((l) => l.pipelineStage === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (l) =>
          l.contactName.toLowerCase().includes(q) ||
          l.phoneNumber.includes(q) ||
          l.location.toLowerCase().includes(q)
      );
    }
    return data;
  }, [activeTab, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">
            Leads & Kontak
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Kelola semua prospek dan pelanggan Anda
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--color-border)] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Tab Filters */}
          <div className="flex items-center bg-[var(--color-bg)] rounded-lg p-1">
            {TABS.map((tab) => {
              const count =
                tab.value === "ALL"
                  ? mockLeads.length
                  : mockLeads.filter((l) => l.pipelineStage === tab.value).length;
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setActiveTab(tab.value);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.value
                      ? "bg-white shadow-sm text-[var(--color-text)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-[11px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama, nomor, atau lokasi..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
              />
            </div>
          </div>

          <button className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] rounded-lg hover:bg-gray-50 transition-all">
            <Filter className="w-4 h-4" />
            Filter Lanjutan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--color-text)]">
                    Nama & No. WA
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                  Jenis Acara
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--color-text)]">
                    Tanggal Acara
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                  Tamu
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                  Stage
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                  Last Interaction
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((lead, i) => (
                <tr
                  key={lead.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)]/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {lead.contactName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">
                          {lead.contactName}
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">
                          {formatPhone(lead.phoneNumber)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-[var(--color-text)]">
                      {lead.eventType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-[var(--color-text)]">
                      {new Date(lead.eventDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm text-[var(--color-text)]">
                        {lead.location}
                      </p>
                      <p className="text-xs text-[var(--color-muted)] truncate max-w-[160px]">
                        {lead.venueName}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-semibold text-[var(--color-text)]">
                      {lead.guestCount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StageBadge stage={lead.pipelineStage} />
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-[var(--color-muted)]">
                      {relativeTime(lead.lastInteraction)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === lead.id ? null : lead.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-[var(--color-muted)]" />
                      </button>
                      {openMenuId === lead.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[var(--color-border)] rounded-lg shadow-lg z-20 py-1 animate-fade-in">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                            onClick={() => setOpenMenuId(null)}
                          >
                            <Eye className="w-4 h-4" />
                            Lihat Detail
                          </Link>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            Buka Chat
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-[var(--color-muted)]">
                      Tidak ada lead yang ditemukan
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
            <p className="text-xs text-[var(--color-muted)]">
              Menampilkan {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} leads
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-[var(--color-primary-600)] text-white"
                      : "hover:bg-white text-[var(--color-muted)]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
