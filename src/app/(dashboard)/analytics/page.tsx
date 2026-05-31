"use client";

import { useState, useEffect } from "react";
import { getDashboardMetrics, getMeetingCount } from "@/app/actions/crm";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import {
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle2,
  Loader2,
  BarChart3,
} from "lucide-react";

const TIME_RANGES = [
  { label: "7 Hari", value: "7d" },
  { label: "30 Hari", value: "30d" },
  { label: "90 Hari", value: "90d" },
  { label: "1 Tahun", value: "1y" },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [metrics, setMetrics] = useState<any>(null);
  const [meetingCount, setMeetingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getDashboardMetrics(), getMeetingCount()])
      .then(([m, mc]) => {
        setMetrics(m);
        setMeetingCount(mc);
      })
      .catch(() => {
        setMetrics({ totalLeads: 0, activeConversations: 0, waitingCS: 0, closingCount: 0 });
        setMeetingCount(0);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-[var(--color-muted)] animate-spin" />
      </div>
    );
  }

  const totalLeads = metrics?.totalLeads || 0;
  const closingCount = metrics?.closingCount || 0;
  const leadCount = totalLeads - meetingCount - closingCount;

  const pipelineData = [
    { name: "Leads", value: leadCount > 0 ? leadCount : 0, fill: "#3b82f6" },
    { name: "Meeting", value: meetingCount, fill: "#f59e0b" },
    { name: "Closing", value: closingCount, fill: "#10b981" },
  ];

  const conversionRate = totalLeads > 0 ? Math.round((closingCount / totalLeads) * 100) : 0;
  const activeConversations = metrics?.activeConversations || 0;

  const stats = [
    { label: "Total Leads", value: totalLeads, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Meeting", value: meetingCount, icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Closing", value: closingCount, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
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
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-1">
            Ringkasan Percakapan
          </h2>
          <p className="text-xs text-[var(--color-muted)] mb-6">Status percakapan aktif</p>
          <div className="space-y-4">
            {[
              { label: "Percakapan Aktif", value: activeConversations, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Menunggu CS", value: metrics?.waitingCS || 0, icon: CheckCircle2, color: "text-red-600", bg: "bg-red-50" },
              { label: "Total Closing", value: closingCount, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
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

        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-1">
            Sumber Leads
          </h2>
          <p className="text-xs text-[var(--color-muted)] mb-6">Dari mana leads Anda berasal</p>
          <div className="space-y-4">
            {[
              { source: "WhatsApp", pct: 80, color: "bg-emerald-500" },
              { source: "Form Website", pct: 60, color: "bg-blue-500" },
              { source: "Referral", pct: 30, color: "bg-violet-500" },
              { source: "Instagram", pct: 20, color: "bg-pink-500" },
              { source: "Google", pct: 10, color: "bg-amber-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--color-text)] w-24">{item.source}</span>
                <div className="flex-1 h-2.5 bg-[var(--color-bg)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-1">
            Activity
          </h2>
          <p className="text-xs text-[var(--color-muted)] mb-6">Ringkasan aktivitas</p>
          <div className="space-y-4">
            {[
              { label: "Total Leads", value: totalLeads, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Meeting", value: meetingCount, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Closing", value: closingCount, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Percakapan", value: activeConversations, color: "text-violet-600", bg: "bg-violet-50" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-10 rounded-full ${item.bg} flex-shrink-0`} />
                <div className="flex-1">
                  <p className="text-xs text-[var(--color-muted)]">{item.label}</p>
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
