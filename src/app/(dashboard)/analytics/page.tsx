"use client";

import { useState } from "react";
import { mockLeads, mockConversations } from "@/lib/mock-data";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";

const TIME_RANGES = [
  { label: "7 Hari", value: "7d" },
  { label: "30 Hari", value: "30d" },
  { label: "90 Hari", value: "90d" },
  { label: "1 Tahun", value: "1y" },
];

const leads = mockLeads;
const conversations = mockConversations;

const totalLeads = leads.length;
const closingCount = leads.filter((l) => l.pipelineStage === "CLOSING").length;
const meetingCount = leads.filter((l) => l.pipelineStage === "MEETING").length;
const leadCount = leads.filter((l) => l.pipelineStage === "LEADS").length;
const resolvedCount = conversations.filter((c) => c.status === "RESOLVED").length;
const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0);

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  const pipelineData = [
    { name: "Leads", value: leadCount, fill: "#3b82f6" },
    { name: "Meeting", value: meetingCount, fill: "#f59e0b" },
    { name: "Closing", value: closingCount, fill: "#10b981" },
  ];

  const conversionRate = totalLeads > 0 ? Math.round((closingCount / totalLeads) * 100) : 0;

  const stats = [
    { label: "Total Leads", value: totalLeads, icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+18%", trendUp: true },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+5%", trendUp: true },
    { label: "Total Messages", value: totalMessages, icon: MessageSquare, color: "text-violet-600", bg: "bg-violet-50", trend: "+32%", trendUp: true },
    { label: "Resolved", value: resolvedCount, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", trend: "+2", trendUp: true },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">
            Analytics
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Insight dan performa bisnis Anda
          </p>
        </div>
        <div className="flex items-center bg-[var(--color-bg)] rounded-lg p-1">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                timeRange === range.value
                  ? "bg-white shadow-sm text-[var(--color-text)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--color-border)] p-5 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-[var(--color-text)] mt-1 font-display">{stat.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className={`w-3.5 h-3.5 ${stat.trendUp ? "text-emerald-500" : "text-red-500"}`} />
              <span className={`text-xs font-medium ${stat.trendUp ? "text-emerald-600" : "text-red-600"}`}>
                {stat.trend}
              </span>
              <span className="text-xs text-[var(--color-muted)]">vs periode lalu</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Chart */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-1">
            Pipeline CRM
          </h2>
          <p className="text-xs text-[var(--color-muted)] mb-4">Distribusi lead berdasarkan stage</p>
          <div className="h-52 flex items-center justify-center">
            <PipelineChart data={pipelineData} />
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border)] grid grid-cols-3 gap-2">
            {pipelineData.map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.fill }} />
                  <span className="text-xs font-medium text-[var(--color-text)]">{item.name}</span>
                </div>
                <p className="text-lg font-bold text-[var(--color-text)]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-1">
            Sumber Leads
          </h2>
          <p className="text-xs text-[var(--color-muted)] mb-6">Dari mana leads Anda berasal</p>
          <div className="space-y-4">
            {[
              { source: "WhatsApp", count: 8, pct: 80, color: "bg-emerald-500" },
              { source: "Form Website", count: 6, pct: 60, color: "bg-blue-500" },
              { source: "Referral", count: 3, pct: 30, color: "bg-violet-500" },
              { source: "Instagram", count: 2, pct: 20, color: "bg-pink-500" },
              { source: "Google", count: 1, pct: 10, color: "bg-amber-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--color-text)] w-24">{item.source}</span>
                <div className="flex-1 h-2.5 bg-[var(--color-bg)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[var(--color-muted)] w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-1">
            AI Response Time
          </h2>
          <p className="text-xs text-[var(--color-muted)] mb-6">Kecepatan rata-rata respons AI</p>
          <div className="flex items-end gap-2 h-40">
            {[0.3, 0.5, 0.4, 0.6, 0.8, 0.7, 0.5].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-[var(--color-primary-500)] rounded-t-md transition-all duration-500"
                  style={{ height: `${val * 120}px`, opacity: 0.3 + val * 0.7 }}
                />
                <span className="text-[10px] text-[var(--color-muted)]">{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-muted)]">Rata-rata</p>
              <p className="text-lg font-bold text-[var(--color-text)]">0.5 detik</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--color-muted)]">Tercepat</p>
              <p className="text-lg font-bold text-emerald-600">0.2 detik</p>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-1">
            Ringkasan Aktivitas
          </h2>
          <p className="text-xs text-[var(--color-muted)] mb-6">30 hari terakhir</p>
          <div className="space-y-4">
            {[
              { label: "Pesan Diterima", value: 156, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Pesan Terkirim (AI)", value: 142, icon: BarChart3, color: "text-violet-600", bg: "bg-violet-50" },
              { label: "CS Handoffs", value: 8, icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Lead Baru", value: 12, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text)]">{item.label}</span>
                </div>
                <span className="text-lg font-bold text-[var(--color-text)]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
