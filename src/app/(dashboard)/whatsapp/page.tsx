"use client";

import { useState } from "react";
import {
  Smartphone,
  Link as LinkIcon,
  Key,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Save,
  ExternalLink,
  Copy,
  AlertCircle,
} from "lucide-react";

export default function WhatsAppPage() {
  const [instanceName, setInstanceName] = useState("wina-crm-prod");
  const [instanceUrl, setInstanceUrl] = useState("https://evolution-api.example.com");
  const [apiKey, setApiKey] = useState("••••••••••••••••");
  const [showKey, setShowKey] = useState(false);
  const [webhookSecret, setWebhookSecret] = useState("whsec_••••••••••••••••");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected");

  const webhookUrl = window?.location?.origin
    ? `${window.location.origin}/api/webhook/wina-crm`
    : "https://wina-crm.com/api/webhook/wina-crm";

  const testConnection = () => {
    setConnectionStatus("connecting");
    setTimeout(() => setConnectionStatus("connected"), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">
          WhatsApp Integration
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Hubungkan Evolution API untuk mengirim dan menerima pesan WhatsApp
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Smartphone className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
                Status Koneksi
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {connectionStatus === "connected" && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600">Terhubung</span>
                  </>
                )}
                {connectionStatus === "disconnected" && (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">Tidak Terhubung</span>
                  </>
                )}
                {connectionStatus === "connecting" && (
                  <>
                    <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                    <span className="text-sm font-medium text-amber-600">Menghubungkan...</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={testConnection}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Test Koneksi
          </button>
        </div>
      </div>

      {/* Evolution API Config */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Key className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
              Evolution API Configuration
            </h2>
            <p className="text-xs text-[var(--color-muted)]">Server Evolution API yang menghubungkan ke WhatsApp</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Instance Name
            </label>
            <input
              type="text"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
              placeholder="wina-crm-prod"
            />
            <p className="text-[11px] text-[var(--color-muted)] mt-1">Nama instance Evolution API Anda</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Base URL
            </label>
            <input
              type="url"
              value={instanceUrl}
              onChange={(e) => setInstanceUrl(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
              placeholder="https://evolution-api.example.com"
            />
            <p className="text-[11px] text-[var(--color-muted)] mt-1">URL server Evolution API (tanpa trailing slash)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[var(--color-muted)] mt-1">Global API Key dari Evolution API</p>
          </div>
        </div>
      </div>

      {/* Webhook Config */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <LinkIcon className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
              Webhook Configuration
            </h2>
            <p className="text-xs text-[var(--color-muted)]">Endpoint untuk menerima pesan WhatsApp masuk</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
            <code className="flex-1 text-sm text-[var(--color-text)] break-all">{webhookUrl}</code>
            <button
              onClick={() => navigator.clipboard?.writeText(webhookUrl)}
              className="p-2 rounded-lg hover:bg-white transition-colors flex-shrink-0"
              title="Copy URL"
            >
              <Copy className="w-4 h-4 text-[var(--color-muted)]" />
            </button>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Cara Setup Webhook di Evolution API</p>
              <ol className="text-xs text-blue-600 mt-1 space-y-1 list-decimal list-inside">
                <li>Buka Evolution API dashboard</li>
                <li>Pilih instance <strong>{instanceName}</strong></li>
                <li>Di tab Webhook, set URL ke endpoint di atas</li>
                <li>Pastikan event <strong>MESSAGES_UPSERT</strong> diaktifkan</li>
              </ol>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Webhook Secret
            </label>
            <input
              type="password"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
            />
            <p className="text-[11px] text-[var(--color-muted)] mt-1">Secret untuk verifikasi request webhook</p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white text-sm font-semibold rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          Simpan Konfigurasi
        </button>
        <a
          href="https://doc.evolution-api.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[var(--color-border)] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Dokumentasi Evolution API
        </a>
      </div>
    </div>
  );
}

import { Eye, EyeOff } from "lucide-react";
