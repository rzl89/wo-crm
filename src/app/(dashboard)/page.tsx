import { getDashboardMetrics, getRecentActivities } from "@/app/actions/crm";
import { relativeTime } from "@/lib/utils";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import {
  Users,
  MessageSquare,
  Headphones,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  MessageCircle,
  GitBranch,
  FileText,
  Zap,
} from "lucide-react";
import Link from "next/link";

const activityIcons: Record<string, typeof MessageCircle> = {
  message: MessageCircle,
  stage_change: GitBranch,
  form_submit: FileText,
  handoff: Headphones,
};

const activityColors: Record<string, string> = {
  message: "bg-blue-100 text-blue-600",
  stage_change: "bg-emerald-100 text-emerald-600",
  form_submit: "bg-amber-100 text-amber-600",
  handoff: "bg-red-100 text-red-600",
};

export default async function DashboardPage() {
  const [metricsData, recentActivities] = await Promise.all([
    getDashboardMetrics(),
    getRecentActivities()
  ]);
  
  // Safe defaults if database fails or returns null
  const data = metricsData || {
    totalLeads: 0,
    activeConversations: 0,
    waitingCS: 0,
    closingCount: 0,
  };

  const metrics = [
    {
      title: "Leads Total",
      value: data.totalLeads,
      icon: Users,
      trend: "+12%",
      trendUp: true,
      color: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      lightText: "text-blue-600",
    },
    {
      title: "Percakapan Aktif",
      value: data.activeConversations,
      icon: MessageSquare,
      trend: "+3",
      trendUp: true,
      color: "from-violet-500 to-violet-600",
      lightBg: "bg-violet-50",
      lightText: "text-violet-600",
    },
    {
      title: "Menunggu CS",
      value: data.waitingCS,
      icon: Headphones,
      trend: "Perlu tindakan",
      trendUp: false,
      color: "from-red-500 to-red-600",
      lightBg: "bg-red-50",
      lightText: "text-red-600",
      urgent: true,
    },
    {
      title: "Closing",
      value: data.closingCount,
      icon: TrendingUp,
      trend: "+25%",
      trendUp: true,
      color: "from-emerald-500 to-emerald-600",
      lightBg: "bg-emerald-50",
      lightText: "text-emerald-600",
    },
  ];

  const pipelineData = [
    { name: "Leads", value: data.totalLeads, fill: "#3b82f6" },
    { name: "Meeting", value: Math.floor(data.totalLeads * 0.4), fill: "#f59e0b" }, // Mock conversion rate
    { name: "Closing", value: data.closingCount, fill: "#10b981" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Selamat datang kembali! Berikut ringkasan performa Anda.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--color-muted)]">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-[var(--color-border)] p-5 card-hover relative overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Decorative pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 islamic-pattern opacity-30 rounded-bl-full" />

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-[var(--color-text)] mt-2 font-display">
                    {metric.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {metric.trendUp ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-red-500" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        metric.urgent
                          ? "text-red-500"
                          : metric.trendUp
                          ? "text-emerald-600"
                          : "text-[var(--color-muted)]"
                      }`}
                    >
                      {metric.trend}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-11 h-11 rounded-xl ${metric.lightBg} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${metric.lightText}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline & Activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Pipeline Funnel */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
              Pipeline CRM
            </h2>
            <span className="text-xs text-[var(--color-muted)]">
              Total: {data.totalLeads} leads
            </span>
          </div>

          <div className="h-48">
            <PipelineChart data={pipelineData} />
          </div>

          {/* Conversion rates */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-blue-600">
                {data.totalLeads}
              </p>
              <p className="text-[10px] text-[var(--color-muted)] uppercase">
                Leads
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-amber-600">
                {Math.floor(data.totalLeads * 0.4)}
              </p>
              <p className="text-[10px] text-[var(--color-muted)] uppercase">
                Meeting
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-emerald-600">
                {data.closingCount}
              </p>
              <p className="text-[10px] text-[var(--color-muted)] uppercase">
                Closing
              </p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
              Aktivitas Terbaru
            </h2>
            <Link
              href="/conversations"
              className="text-xs text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-1 max-h-[360px] overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, i) => {
                const Icon = activityIcons[activity.type] || MessageCircle;
                const colorClass = activityColors[activity.type] || "bg-gray-100 text-gray-600";

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--color-bg)] transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text)] truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5 line-clamp-1">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-[11px] text-[var(--color-muted)] flex-shrink-0 mt-0.5">
                      {relativeTime(activity.timestamp)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-[var(--color-muted)]">Belum ada aktivitas</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[var(--color-primary-950)] to-[var(--color-primary-900)] rounded-xl p-6 islamic-pattern-dark">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Quick Actions
            </h3>
            <p className="text-sm text-emerald-200/70 mt-1">
              Akses cepat ke fitur yang sering digunakan
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/handoff"
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-red-500/30"
            >
              <Headphones className="w-4 h-4" />
              Antrian CS ({data.waitingCS})
            </Link>
            <Link
              href="/conversations"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors backdrop-blur-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Lihat Percakapan
            </Link>
            <Link
              href="/leads"
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-gold-500)] hover:bg-[var(--color-gold-700)] text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-amber-500/20"
            >
              <Users className="w-4 h-4" />
              Kelola Leads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
