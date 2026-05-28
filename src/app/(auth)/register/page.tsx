"use client";

import Link from "next/link";
import { register } from "@/app/actions/auth";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white font-semibold rounded-lg transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? "Memproses..." : "Daftar Sekarang"}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await register(formData);
    },
    null
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border)] p-8">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 text-center">
        Daftar Tenant Baru
      </h2>
      
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-3 bg-red-100 text-red-600 text-sm rounded-lg">
            {state.error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Nama Anda
          </label>
          <input
            type="text"
            name="fullName"
            required
            className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Nama Bisnis (WO/Catering)
          </label>
          <input
            type="text"
            name="tenantName"
            required
            className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            placeholder="Wina Al-Husna Wedding"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            placeholder="email@perusahaan.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            placeholder="••••••••"
          />
        </div>
        <SubmitButton />
      </form>
      
      <p className="text-center text-sm text-[var(--color-muted)] mt-6">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-[var(--color-gold-600)] font-semibold hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
