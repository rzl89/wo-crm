"use client";

import { useState, useEffect } from "react";
import { DocStatusBadge } from "@/components/shared/Badges";
import { relativeTime } from "@/lib/utils";
import {
  BookOpen,
  Upload,
  Search,
  FileText,
  FileSpreadsheet,
  File as FilePdf,
  File as FileDoc,
  Trash2,
  RefreshCw,
  HardDrive,
  Layers,
  AlertCircle,
  Loader2,
} from "lucide-react";

const fileIconMap: Record<string, typeof FileText> = {
  pdf: FilePdf,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  docx: FileDoc,
};

type DocStatus = "PROCESSING" | "INDEXED" | "FAILED";

const TABS: { label: string; value: DocStatus | "ALL" }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Indexed", value: "INDEXED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Failed", value: "FAILED" },
];

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
}

import { getKnowledgeDocuments } from "@/app/actions/crm";

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DocStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    getKnowledgeDocuments()
      .then((data) => setDocuments(data as any[]))
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = documents.filter((doc) => {
    if (activeTab !== "ALL" && doc.status !== activeTab) return false;
    if (search.trim()) {
      return (doc.fileName || "").toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const totalChunks = documents.reduce((sum, d) => sum + (d.chunkCount || 0), 0);
  const totalSize = documents.reduce((sum, d) => sum + (d.fileSize || 0), 0);

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
            Knowledge Base
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Dokumen referensi untuk AI menjawab pertanyaan customer
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white text-sm font-semibold rounded-lg transition-colors">
          <Upload className="w-4 h-4" />
          Upload Dokumen
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Dokumen", value: documents.length, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Chunks", value: totalChunks, icon: Layers, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Total Size", value: formatBytes(totalSize), icon: HardDrive, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--color-border)] p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted)]">{stat.label}</p>
              <p className="text-lg font-bold text-[var(--color-text)]">{stat.value}</p>
            </div>
          </div>
        ))}
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
                placeholder="Cari nama dokumen..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Nama File</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Tipe</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Ukuran</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Chunks</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Upload</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => {
              const Icon = fileIconMap[doc.fileType] || FileText;
              return (
                <tr key={doc.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-bg)] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[var(--color-muted)]" />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-text)]">{doc.fileName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-mono text-[var(--color-muted)] uppercase bg-[var(--color-bg)] px-2 py-0.5 rounded">
                      {doc.fileType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm text-[var(--color-text)]">{formatBytes(doc.fileSize || 0)}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-semibold text-[var(--color-text)]">{doc.chunkCount ?? "-"}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <DocStatusBadge status={doc.status} />
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-[var(--color-muted)]">{relativeTime(doc.uploadedAt)}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {doc.status === "FAILED" && (
                        <button className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="Retry Indexing">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-[var(--color-muted)]">Tidak ada dokumen. Upload dokumen pertama Anda.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
