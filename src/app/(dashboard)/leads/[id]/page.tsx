"use client";

import { useEffect, useState, use } from "react";
import { getLeadById } from "@/app/actions/crm";
import { formatPhone, relativeTime } from "@/lib/utils";
import { StageBadge, ConvStatusBadge } from "@/components/shared/Badges";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Calendar,
  MapPin,
  Users,
  Building2,
  Clock,
  MessageSquare,
  Edit3,
  GitBranch,
} from "lucide-react";

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeadById(id).then((data) => {
      setLead(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <p className="text-lg text-[var(--color-muted)]">Loading...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <p className="text-lg text-[var(--color-muted)]">Lead tidak ditemukan</p>
        <Link href="/leads" className="mt-4 text-sm text-[var(--color-primary-600)] hover:underline">
          ← Kembali ke daftar leads
        </Link>
      </div>
    );
  }

  const conv = lead.conversation;

  const stageHistory = [
    { stage: "LEADS", date: lead.createdAt, by: "Form Submission" },
    ...(lead.pipelineStage === "MEETING" || lead.pipelineStage === "CLOSING"
      ? [{ stage: "MEETING", date: "2026-05-20T10:00:00Z", by: "AI Auto-detect" }]
      : []),
    ...(lead.pipelineStage === "CLOSING"
      ? [{ stage: "CLOSING", date: "2026-05-26T14:00:00Z", by: "Admin Wina" }]
      : []),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <Link
        href="/leads"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Leads
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-800)] flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {lead.contactName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">
                {lead.contactName}
              </h1>
              <p className="text-sm text-[var(--color-muted)] flex items-center gap-2 mt-1">
                <Phone className="w-3.5 h-3.5" />
                {formatPhone(lead.phoneNumber)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StageBadge stage={lead.pipelineStage} size="md" />
            {conv && <ConvStatusBadge status={conv.status} />}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Info & CRM */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Grid */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-4">
              Informasi Acara
            </h2>
            <div className="space-y-4">
              {[
                { icon: Calendar, label: "Tanggal Acara", value: lead.eventDate ? new Date(lead.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "-" },
                { icon: Building2, label: "Jenis Acara", value: lead.eventType || "-" },
                { icon: MapPin, label: "Lokasi", value: lead.location || "-" },
                { icon: Building2, label: "Venue", value: lead.venueName || "-" },
                { icon: Users, label: "Estimasi Tamu", value: lead.guestCount ? `${lead.guestCount.toLocaleString()} orang` : "-" },
                { icon: Clock, label: "Terakhir Aktif", value: relativeTime(lead.lastInteraction) },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-bg)] flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-[var(--color-muted)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">{item.label}</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
                Catatan Internal
              </h2>
              <Edit3 className="w-4 h-4 text-[var(--color-muted)]" />
            </div>
            <textarea
              defaultValue={lead.notes || ""}
              placeholder="Tambahkan catatan..."
              className="w-full h-24 p-3 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] font-mono"
            />
          </div>

          {/* Stage History */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-4">
              Riwayat Stage
            </h2>
            <div className="space-y-0">
              {stageHistory.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 relative">
                  {/* Line */}
                  {i < stageHistory.length - 1 && (
                    <div className="absolute left-[15px] top-8 w-0.5 h-full bg-[var(--color-border)]" />
                  )}
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center flex-shrink-0 z-10">
                    <GitBranch className="w-3.5 h-3.5 text-[var(--color-primary-700)]" />
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      → {entry.stage}
                    </p>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">
                      {relativeTime(entry.date)} • oleh {entry.by}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Conversation History */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[var(--color-border)] flex flex-col" style={{ maxHeight: "calc(100vh - 180px)" }}>
          <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--color-primary-600)]" />
              Riwayat Percakapan
            </h2>
            {conv && (
              <Link
                href={`/conversations?leadId=${id}`}
                className="text-xs text-[var(--color-primary-600)] hover:underline font-medium"
              >
                Buka di Live Chat →
              </Link>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {conv && conv.messages.length > 0 ? (
              conv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === "OUTBOUND" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 ${
                      msg.direction === "OUTBOUND" ? "bubble-outbound" : "bubble-inbound"
                    }`}
                  >
                    <p className="text-sm text-[var(--color-text)] whitespace-pre-line leading-relaxed">
                      {msg.content}
                    </p>
                    <p className={`text-[10px] mt-2 ${
                      msg.direction === "OUTBOUND" ? "text-emerald-600/60 text-right" : "text-gray-400"
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {msg.direction === "OUTBOUND" && " ✓✓"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <MessageSquare className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-sm text-[var(--color-muted)]">
                  Belum ada percakapan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
