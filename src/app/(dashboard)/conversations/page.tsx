"use client";

import { useState, useRef, useEffect } from "react";
import { formatPhone, relativeTime, getInitials } from "@/lib/utils";
import { StageBadge, ConvStatusBadge } from "@/components/shared/Badges";
import { getConversations } from "@/app/actions/crm";
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Calendar,
  MapPin,
  Users,
  Bot,
  UserCheck,
  RotateCcw,
  CheckCircle2,
  MessageSquare,
  Smile,
  Loader2,
} from "lucide-react";

type ConvStatus = "AI_HANDLING" | "WAITING_CS" | "CS_HANDLING" | "RESOLVED";

const CONV_TABS: { label: string; icon: string; value: ConvStatus | "ALL" }[] = [
  { label: "Semua", icon: "💬", value: "ALL" },
  { label: "AI", icon: "🤖", value: "AI_HANDLING" },
  { label: "CS", icon: "👤", value: "CS_HANDLING" },
  { label: "Menunggu", icon: "⏳", value: "WAITING_CS" },
];

export default function ConversationsPage() {
  const [activeTab, setActiveTab] = useState<ConvStatus | "ALL">("ALL");
  const [selectedId, setSelectedId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [conversationsData, setConversationsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getConversations()
      .then((data) => {
        setConversationsData(data as any[]);
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].id);
        }
      })
      .catch(() => setConversationsData([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = conversationsData.filter((c) => {
    if (activeTab !== "ALL" && c.status !== activeTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (c.name || "").toLowerCase().includes(q) ||
        (c.phone || "").includes(q)
      );
    }
    return true;
  });

  const selected = conversationsData.find((c) => c.id === selectedId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, selected?.messages?.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-[var(--color-muted)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ height: "calc(100vh - var(--header-height) - 48px)" }}>
      <div className="flex h-full bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="w-[340px] border-r border-[var(--color-border)] flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-3">
              Percakapan
            </h2>
            <div className="flex items-center gap-1 mb-3">
              {CONV_TABS.map((tab) => {
                const count =
                  tab.value === "ALL"
                    ? conversationsData.length
                    : conversationsData.filter((c) => c.status === tab.value).length;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.value
                        ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border border-[var(--color-primary-100)]"
                        : "text-[var(--color-muted)] hover:bg-[var(--color-bg)]"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari percakapan..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full flex items-start gap-3 p-4 text-left border-b border-[var(--color-border)] transition-colors ${
                  selectedId === conv.id
                    ? "bg-[var(--color-primary-50)]"
                    : "hover:bg-[var(--color-bg)]"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(conv.name || "Unknown")}
                  </div>
                  {conv.status === "WAITING_CS" && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white badge-bounce" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                      {conv.name}
                    </p>
                    <span className="text-[10px] text-[var(--color-muted)] flex-shrink-0">
                      {relativeTime(conv.time)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">
                    {conv.lastMessage}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <ConvStatusBadge status={conv.status} />
                    {conv.unread > 0 && (
                      <span className="min-w-[18px] h-[18px] bg-[var(--color-primary-600)] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="w-10 h-10 text-gray-200 mb-2" />
                <p className="text-xs text-[var(--color-muted)]">Tidak ada percakapan</p>
              </div>
            )}
          </div>
        </div>

        {selected ? (
          <>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-5 py-3 border-b border-[var(--color-border)] flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(selected.name || "")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {selected.name}
                    </p>
                    <p className="text-[11px] text-[var(--color-muted)]">
                      {formatPhone(selected.phone || "")}
                    </p>
                  </div>
                </div>
                <ConvStatusBadge status={selected.status} />
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fafaf7]">
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-[var(--color-border)]" />
                  <span className="text-[10px] text-[var(--color-muted)] px-2 py-0.5 bg-white rounded-full border border-[var(--color-border)]">
                    Hari ini
                  </span>
                  <div className="flex-1 h-px bg-[var(--color-border)]" />
                </div>

                {selected.messages?.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.direction === "OUTBOUND" || msg.direction === "OUTBOUND_AI" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] px-4 py-3 shadow-sm ${
                      msg.direction === "OUTBOUND" || msg.direction === "OUTBOUND_AI" ? "bubble-outbound" : "bubble-inbound"
                    }`}>
                      {(msg.direction === "OUTBOUND" || msg.direction === "OUTBOUND_AI") && (
                        <p className="text-[10px] text-[var(--color-primary-600)] font-semibold mb-1 flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          Mirna AI
                        </p>
                      )}
                      <p className="text-sm text-[var(--color-text)] whitespace-pre-line leading-relaxed">
                        {msg.content}
                      </p>
                      <p className={`text-[10px] mt-2 ${
                        (msg.direction === "OUTBOUND" || msg.direction === "OUTBOUND_AI") ? "text-emerald-600/50 text-right" : "text-gray-400"
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {(msg.direction === "OUTBOUND" || msg.direction === "OUTBOUND_AI") && (msg.isRead ? " ✓✓" : " ✓")}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="px-4 py-3 border-t border-[var(--color-border)] bg-white">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors">
                    <Paperclip className="w-4 h-4 text-[var(--color-muted)]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors">
                    <Smile className="w-4 h-4 text-[var(--color-muted)]" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      selected.status === "AI_HANDLING"
                        ? "AI sedang menangani percakapan ini..."
                        : "Ketik pesan..."
                    }
                    disabled={selected.status === "AI_HANDLING"}
                    className="flex-1 px-4 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    disabled={!newMessage.trim() || selected.status === "AI_HANDLING"}
                    className="p-2.5 rounded-lg bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-[280px] border-l border-[var(--color-border)] flex flex-col flex-shrink-0 bg-white">
              <div className="p-5 border-b border-[var(--color-border)] text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-800)] flex items-center justify-center text-white text-xl font-bold mx-auto shadow-lg">
                  {getInitials(selected.name || "")}
                </div>
                <h3 className="font-display text-base font-bold text-[var(--color-text)] mt-3">
                  {selected.name}
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  {formatPhone(selected.phone || "")}
                </p>
                <div className="mt-3">
                  <StageBadge stage="LEADS" size="md" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {[
                  { icon: Calendar, label: "Tanggal Acara", value: "-" },
                  { icon: MapPin, label: "Lokasi", value: "-" },
                  { icon: Users, label: "Tamu", value: "0 orang" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <item.icon className="w-4 h-4 text-[var(--color-muted)] mt-0.5" />
                    <div>
                      <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-medium text-[var(--color-text)]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-[var(--color-border)] space-y-2">
                {selected.status === "AI_HANDLING" && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                    <UserCheck className="w-4 h-4" />
                    Ambil Alih
                  </button>
                )}
                {selected.status === "WAITING_CS" && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors badge-bounce">
                    <UserCheck className="w-4 h-4" />
                    Ambil Alih Sekarang
                  </button>
                )}
                {selected.status === "CS_HANDLING" && (
                  <>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
                      <RotateCcw className="w-4 h-4" />
                      Kembalikan ke AI
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                      Tandai Selesai
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-sm text-[var(--color-muted)]">Pilih percakapan untuk memulai</p>
          </div>
        )}
      </div>
    </div>
  );
}
