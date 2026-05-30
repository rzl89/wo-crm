"use client";

import { useState } from "react";
import {
  Bot,
  Settings,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  MessageSquare,
  Brain,
  Sparkles,
} from "lucide-react";

export default function AISettingsPage() {
  const [personaName, setPersonaName] = useState("Mirna");
  const [aiModel, setAiModel] = useState("gpt-4o");
  const [systemPrompt, setSystemPrompt] = useState(
    "Kamu adalah Mirna, AI assistant dari Wina Al-Husna Wedding & Catering. Kamu membantu customer dengan ramah, profesional, dan islami. Selalu gunakan bahasa Indonesia yang sopan. Tawarkan paket yang sesuai dengan kebutuhan customer. Jika customer meminta bicara dengan CS manusia, akhiri percakapan dengan meminta mereka mengetik 'CS1'."
  );
  const [showPrompt, setShowPrompt] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">
          AI Settings
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Konfigurasi AI assistant untuk percakapan dengan customer
        </p>
      </div>

      {/* AI Identity */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Bot className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
              Identitas AI
            </h2>
            <p className="text-xs text-[var(--color-muted)]">Nama dan model AI yang digunakan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Nama AI Persona
            </label>
            <input
              type="text"
              value={personaName}
              onChange={(e) => setPersonaName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
            />
            <p className="text-[11px] text-[var(--color-muted)] mt-1">Nama yang muncul di chat customer</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
              Model AI
            </label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
            >
              <option value="gpt-4o">GPT-4o (Recommended)</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
            </select>
            <p className="text-[11px] text-[var(--color-muted)] mt-1">Model yang digunakan untuk menghasilkan respons</p>
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Brain className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
              System Prompt
            </h2>
            <p className="text-xs text-[var(--color-muted)]">Instruksi dasar untuk AI assistant</p>
          </div>
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
          >
            {showPrompt ? <EyeOff className="w-4 h-4 text-[var(--color-muted)]" /> : <Eye className="w-4 h-4 text-[var(--color-muted)]" />}
          </button>
        </div>

        {showPrompt && (
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={8}
            className="w-full p-4 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] font-mono leading-relaxed"
          />
        )}
      </div>

      {/* Context Settings */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--color-text)]">
              Konteks Percakapan
            </h2>
            <p className="text-xs text-[var(--color-muted)]">Jumlah pesan sebelumnya yang dikirim ke AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Max Context Messages", value: "20", desc: "Pesan terakhir yang diingat" },
            { label: "Max Response Tokens", value: "1024", desc: "Batas panjang respons AI" },
            { label: "Temperature", value: "0.7", desc: "Kreativitas respons (0-1)" },
          ].map((item, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                {item.label}
              </label>
              <input
                type="text"
                defaultValue={item.value}
                className="w-full px-4 py-2.5 text-sm bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all"
              />
              <p className="text-[11px] text-[var(--color-muted)] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Save / Reset */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Konfigurasi
            </>
          )}
        </button>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[var(--color-border)] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          <RotateCcw className="w-4 h-4" />
          Reset Default
        </button>
      </div>
    </div>
  );
}
