"use client";

import { mockConversations } from "@/lib/mock-data";
import { formatPhone, getInitials } from "@/lib/utils";
import { ConvStatusBadge } from "@/components/shared/Badges";
import { getConversations } from "@/app/actions/crm";
import {
  Headphones,
  UserCheck,
  Clock,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function HandoffPage() {
  const [conversationsData, setConversationsData] = useState<any[]>(mockConversations);

  useEffect(() => {
    getConversations().then((data) => {
      setConversationsData(data as any[]);
    });
  }, []);

  const waiting = conversationsData.filter((c) => c.status === "WAITING_CS");
  const resolved = conversationsData.filter((c) => c.status === "RESOLVED");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">
            Antrian CS Handoff
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Customer yang meminta berbicara dengan CS manusia
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
          <Headphones className="w-4 h-4 text-red-600" />
          <span className="text-sm font-bold text-red-600">{waiting.length} Menunggu</span>
        </div>
      </div>

      {/* Waiting Queue */}
      {waiting.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {waiting.map((conv) => (
            <WaitingCard key={conv.id} conv={conv} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-12 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-200 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-[var(--color-text)]">
            Semua Terlayani! 🎉
          </h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Tidak ada customer yang menunggu saat ini
          </p>
        </div>
      )}

      {/* Resolved Today */}
      {resolved.length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-4">
            Selesai Hari Ini
          </h2>
          <div className="space-y-3">
            {resolved.map((conv) => {
              const contactName = conv.name || conv.lead?.contactName || "Unknown";
              return (
              <div
                key={conv.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-[var(--color-bg)]"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(contactName)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    {contactName}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    Ditangani oleh: {conv.assignedTo || "—"}
                  </p>
                </div>
                <ConvStatusBadge status={conv.status} />
              </div>
            )})}
          </div>
        </div>
      )}
    </div>
  );
}

function WaitingCard({ conv }: { conv: any }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(conv.time || conv.lastMessageAt).getTime();
    if (isNaN(start)) return;
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [conv.time, conv.lastMessageAt]);

  const formatElapsed = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}j ${m}m ${sec}d`;
    if (m > 0) return `${m}m ${sec}d`;
    return `${sec}d`;
  };

  const messages = conv.messages || [];
  const contactName = conv.name || conv.lead?.contactName || "Unknown";
  const phoneNumber = conv.phone || conv.lead?.phoneNumber || "";

  return (
    <div className="bg-white rounded-xl border-2 border-red-200 p-5 card-hover relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-amber-500" />

      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-sm font-bold">
            {getInitials(contactName)}
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center badge-bounce">
            <Headphones className="w-3 h-3 text-white" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-bold text-[var(--color-text)]">
                {contactName}
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                {formatPhone(phoneNumber)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span className="text-sm font-bold text-red-600 font-mono">
                {formatElapsed(elapsed)}
              </span>
            </div>
          </div>

          {/* Last message preview */}
          <div className="mt-3 p-3 bg-red-50/50 rounded-lg border border-red-100">
            <p className="text-xs text-red-600 font-semibold mb-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              Pesan terakhir sebelum CS1:
            </p>
            <p className="text-sm text-[var(--color-text)] line-clamp-2">
              {messages[messages.length - 2]?.content || "—"}
            </p>
          </div>

          {/* Action */}
          <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-red-500/20">
            <UserCheck className="w-4 h-4" />
            Ambil Alih Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
